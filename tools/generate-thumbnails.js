#!/usr/bin/env node

/**
 * Скрипт для автоматической генерации миниатюр изображений
 * 
 * Этот скрипт сканирует папку static/images и создает миниатюры
 * для всех изображений, сохраняя их в static/images/thumbnails
 * 
 * Использует Sharp для обработки изображений
 * 
 * Автор: JT-Lab Docs Team
 * Версия: 2.0.0
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Конфигурация
const CONFIG = {
  // Пути
  SOURCE_DIR: path.join(__dirname, '..', 'static', 'images'),
  THUMBNAILS_DIR: path.join(__dirname, '..', 'static', 'images', 'thumbnails'),
  LOGS_DIR: path.join(__dirname, '..', 'tools', 'logs'),
  
  // Настройки миниатюр
  THUMBNAIL_WIDTH: 300,
  THUMBNAIL_HEIGHT: 200,
  THUMBNAIL_QUALITY: 85,
  
  // Поддерживаемые форматы
  SUPPORTED_FORMATS: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.tiff', '.bmp'],
  
  // Исключения (файлы, для которых не создавать миниатюры)
  EXCLUDE_PATTERNS: ['-thumb.', 'thumbnails', '.svg'],
  
  // Настройки логирования
  LOG_LEVEL: 'INFO', // DEBUG, INFO, WARN, ERROR
  LOG_TO_FILE: true,
  LOG_TO_CONSOLE: true
};

// Система логирования
class Logger {
  constructor() {
    this.logFile = path.join(CONFIG.LOGS_DIR, `thumbnails-${this.getTimestamp()}.log`);
    this.ensureLogsDir();
  }

  ensureLogsDir() {
    if (!fs.existsSync(CONFIG.LOGS_DIR)) {
      fs.mkdirSync(CONFIG.LOGS_DIR, { recursive: true });
    }
  }

  getTimestamp() {
    return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  }

  formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const dataStr = data ? ` | ${JSON.stringify(data)}` : '';
    return `[${timestamp}] [${level}] ${message}${dataStr}`;
  }

  log(level, message, data = null) {
    const formattedMessage = this.formatMessage(level, message, data);
    
    if (CONFIG.LOG_TO_CONSOLE) {
      const colors = {
        DEBUG: '\x1b[36m', // Cyan
        INFO: '\x1b[32m',  // Green
        WARN: '\x1b[33m',  // Yellow
        ERROR: '\x1b[31m', // Red
        RESET: '\x1b[0m'
      };
      console.log(`${colors[level]}${formattedMessage}${colors.RESET}`);
    }
    
    if (CONFIG.LOG_TO_FILE) {
      fs.appendFileSync(this.logFile, formattedMessage + '\n');
    }
  }

  debug(message, data = null) {
    if (CONFIG.LOG_LEVEL === 'DEBUG') {
      this.log('DEBUG', message, data);
    }
  }

  info(message, data = null) {
    if (['DEBUG', 'INFO'].includes(CONFIG.LOG_LEVEL)) {
      this.log('INFO', message, data);
    }
  }

  warn(message, data = null) {
    if (['DEBUG', 'INFO', 'WARN'].includes(CONFIG.LOG_LEVEL)) {
      this.log('WARN', message, data);
    }
  }

  error(message, data = null) {
    this.log('ERROR', message, data);
  }
}

// Основной класс для генерации миниатюр
class ThumbnailGenerator {
  constructor() {
    this.logger = new Logger();
    this.stats = {
      processed: 0,
      created: 0,
      skipped: 0,
      errors: 0,
      startTime: Date.now()
    };
  }

  // Проверка, поддерживается ли формат файла
  isSupportedFormat(filename) {
    const ext = path.extname(filename).toLowerCase();
    return CONFIG.SUPPORTED_FORMATS.includes(ext);
  }

  // Проверка, нужно ли исключить файл
  shouldExclude(filename) {
    return CONFIG.EXCLUDE_PATTERNS.some(pattern => 
      filename.toLowerCase().includes(pattern.toLowerCase())
    );
  }

  // Получение списка изображений для обработки
  getImageFiles() {
    this.logger.info('Сканирование папки с изображениями', { 
      sourceDir: CONFIG.SOURCE_DIR 
    });

    if (!fs.existsSync(CONFIG.SOURCE_DIR)) {
      throw new Error(`Папка с изображениями не найдена: ${CONFIG.SOURCE_DIR}`);
    }

    const files = fs.readdirSync(CONFIG.SOURCE_DIR);
    const imageFiles = files.filter(file => {
      const fullPath = path.join(CONFIG.SOURCE_DIR, file);
      const stat = fs.statSync(fullPath);
      
      return stat.isFile() && 
             this.isSupportedFormat(file) && 
             !this.shouldExclude(file);
    });

    this.logger.info(`Найдено ${imageFiles.length} изображений для обработки`, {
      files: imageFiles
    });

    return imageFiles;
  }

  // Проверка, существует ли уже миниатюра
  thumbnailExists(filename) {
    const thumbnailName = this.getThumbnailName(filename);
    const thumbnailPath = path.join(CONFIG.THUMBNAILS_DIR, thumbnailName);
    return fs.existsSync(thumbnailPath);
  }

  // Генерация имени миниатюры: image.jpg -> image-thumb.jpg
  getThumbnailName(filename) {
    const ext = path.extname(filename);
    const name = path.basename(filename, ext);
    return `${name}-thumb${ext}`;
  }

  // Создание миниатюры с помощью Sharp
  async createThumbnail(sourceFile, thumbnailFile) {
    try {
      const sourcePath = path.join(CONFIG.SOURCE_DIR, sourceFile);
      const thumbnailPath = path.join(CONFIG.THUMBNAILS_DIR, thumbnailFile);

      this.logger.debug('Создание миниатюры', {
        source: sourceFile,
        thumbnail: thumbnailFile,
        sourcePath,
        thumbnailPath
      });

      // Получаем информацию об исходном изображении
      const metadata = await sharp(sourcePath).metadata();
      this.logger.debug('Метаданные изображения', {
        source: sourceFile,
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: metadata.size
      });

      // Создаем миниатюру с помощью Sharp
      await sharp(sourcePath)
        .resize(CONFIG.THUMBNAIL_WIDTH, CONFIG.THUMBNAIL_HEIGHT, {
          fit: 'cover', // Обрезаем по центру, сохраняя пропорции
          position: 'center'
        })
        .jpeg({ 
          quality: CONFIG.THUMBNAIL_QUALITY,
          progressive: true // Прогрессивный JPEG для лучшей загрузки
        })
        .toFile(thumbnailPath);

      // Проверяем, что файл создался
      if (fs.existsSync(thumbnailPath)) {
        const stats = fs.statSync(thumbnailPath);
        const compressionRatio = ((metadata.size - stats.size) / metadata.size * 100).toFixed(1);
        
        this.logger.info('Миниатюра создана успешно', {
          source: sourceFile,
          thumbnail: thumbnailFile,
          originalSize: metadata.size,
          thumbnailSize: stats.size,
          compressionRatio: `${compressionRatio}%`,
          originalDimensions: `${metadata.width}x${metadata.height}`,
          thumbnailDimensions: `${CONFIG.THUMBNAIL_WIDTH}x${CONFIG.THUMBNAIL_HEIGHT}`
        });
        return true;
      } else {
        throw new Error('Файл миниатюры не был создан');
      }

    } catch (error) {
      this.logger.error('Ошибка при создании миниатюры', {
        source: sourceFile,
        thumbnail: thumbnailFile,
        error: error.message
      });
      return false;
    }
  }

  // Создание папки для миниатюр
  ensureThumbnailsDir() {
    if (!fs.existsSync(CONFIG.THUMBNAILS_DIR)) {
      fs.mkdirSync(CONFIG.THUMBNAILS_DIR, { recursive: true });
      this.logger.info('Создана папка для миниатюр', { 
        dir: CONFIG.THUMBNAILS_DIR 
      });
    }
  }

  // Проверка доступности Sharp
  async checkSharp() {
    try {
      // Создаем тестовое изображение для проверки Sharp
      const testBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
      await sharp(testBuffer).resize(1, 1).toBuffer();
      this.logger.info('✅ Sharp работает корректно');
      return true;
    } catch (error) {
      throw new Error(`Sharp не работает корректно: ${error.message}`);
    }
  }

  // Основной метод генерации
  async generate() {
    try {
      this.logger.info('🚀 Запуск генерации миниатюр с Sharp', {
        config: {
          sourceDir: CONFIG.SOURCE_DIR,
          thumbnailsDir: CONFIG.THUMBNAILS_DIR,
          thumbnailSize: `${CONFIG.THUMBNAIL_WIDTH}x${CONFIG.THUMBNAIL_HEIGHT}`,
          quality: CONFIG.THUMBNAIL_QUALITY
        }
      });

      // Проверяем доступность Sharp
      await this.checkSharp();

      // Создаем папку для миниатюр
      this.ensureThumbnailsDir();

      // Получаем список изображений
      const imageFiles = this.getImageFiles();

      if (imageFiles.length === 0) {
        this.logger.warn('⚠️ Изображения для обработки не найдены');
        return;
      }

      // Обрабатываем каждое изображение
      for (const imageFile of imageFiles) {
        this.stats.processed++;
        
        const thumbnailName = this.getThumbnailName(imageFile);
        
        if (this.thumbnailExists(imageFile)) {
          this.logger.info(`⏭️ Пропуск (миниатюра уже существует)`, {
            source: imageFile,
            thumbnail: thumbnailName
          });
          this.stats.skipped++;
          continue;
        }

        this.logger.info(`🔄 Обработка изображения ${this.stats.processed}/${imageFiles.length}`, {
          source: imageFile
        });

        const success = await this.createThumbnail(imageFile, thumbnailName);
        
        if (success) {
          this.stats.created++;
        } else {
          this.stats.errors++;
        }
      }

      // Выводим итоговую статистику
      const duration = Date.now() - this.stats.startTime;
      this.logger.info('✅ Генерация миниатюр завершена', {
        stats: {
          ...this.stats,
          duration: `${duration}ms`,
          durationSeconds: `${(duration / 1000).toFixed(2)}s`
        }
      });

      // Сохраняем статистику в файл
      this.saveStats();

    } catch (error) {
      this.logger.error('❌ Критическая ошибка', {
        error: error.message,
        stack: error.stack
      });
      process.exit(1);
    }
  }

  // Сохранение статистики
  saveStats() {
    const statsFile = path.join(CONFIG.LOGS_DIR, 'last-run-stats.json');
    const statsData = {
      ...this.stats,
      endTime: Date.now(),
      config: CONFIG,
      logFile: this.logger.logFile,
      engine: 'Sharp'
    };
    
    fs.writeFileSync(statsFile, JSON.stringify(statsData, null, 2));
    this.logger.info('📊 Статистика сохранена', { statsFile });
  }
}

// Обработка аргументов командной строки
function parseArgs() {
  const args = process.argv.slice(2);
  
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--debug':
        CONFIG.LOG_LEVEL = 'DEBUG';
        break;
      case '--width':
        CONFIG.THUMBNAIL_WIDTH = parseInt(args[++i]) || CONFIG.THUMBNAIL_WIDTH;
        break;
      case '--height':
        CONFIG.THUMBNAIL_HEIGHT = parseInt(args[++i]) || CONFIG.THUMBNAIL_HEIGHT;
        break;
      case '--quality':
        CONFIG.THUMBNAIL_QUALITY = parseInt(args[++i]) || CONFIG.THUMBNAIL_QUALITY;
        break;
      case '--help':
        console.log(`
Использование: node generate-thumbnails.js [опции]

Опции:
  --debug              Включить подробное логирование
  --width <число>      Ширина миниатюры (по умолчанию: ${CONFIG.THUMBNAIL_WIDTH})
  --height <число>     Высота миниатюры (по умолчанию: ${CONFIG.THUMBNAIL_HEIGHT})
  --quality <число>    Качество JPEG (1-100, по умолчанию: ${CONFIG.THUMBNAIL_QUALITY})
  --help               Показать эту справку

Примеры:
  node generate-thumbnails.js
  node generate-thumbnails.js --debug
  node generate-thumbnails.js --width 400 --height 300 --quality 90

Особенности:
  - Использует Sharp для быстрой обработки изображений
  - Создает миниатюры с именем: image.jpg -> image-thumb.jpg
  - Поддерживает форматы: JPG, PNG, GIF, WebP, TIFF, BMP
  - Автоматически обрезает по центру с сохранением пропорций
        `);
        process.exit(0);
        break;
    }
  }
}

// Главная функция
async function main() {
  console.log('🖼️ JT-Lab Docs - Генератор миниатюр (Sharp)');
  console.log('============================================\n');

  parseArgs();

  const generator = new ThumbnailGenerator();
  await generator.generate();
}

// Запуск скрипта
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Неожиданная ошибка:', error);
    process.exit(1);
  });
}

module.exports = { ThumbnailGenerator, CONFIG };
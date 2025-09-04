import React, { useEffect } from 'react';

interface ImagePreviewProps {
  enableLogs?: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ enableLogs = false }) => {
  useEffect(() => {
    if (enableLogs) {
      console.log('🖼️ Image Preview: Компонент загружен, инициализируем JavaScript');
    }

    // Встраиваем JavaScript код прямо в компонент
    const initImagePreview = () => {
      // Функция для условного логирования
      const log = (...args: any[]) => {
        if (enableLogs) {
          console.log(...args);
        }
      };

      log('🖼️ Image Preview: Инициализация начата');

      // Создаем модальное окно
      function createModal() {
        const modal = document.createElement('div');
        modal.id = 'image-preview-modal';
        modal.innerHTML = `
          <div class="modal-overlay">
            <div class="modal-content">
              <span class="modal-close">&times;</span>
              <img class="modal-image" src="" alt="">
              <div class="modal-caption"></div>
            </div>
          </div>
        `;
        document.body.appendChild(modal);
        return modal;
      }

      // CSS стили для модального окна
      function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
          #image-preview-modal {
            display: none;
            position: fixed;
            z-index: 10000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            animation: fadeIn 0.3s ease;
          }

          #image-preview-modal.show {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .modal-overlay {
            position: relative;
            max-width: 90%;
            max-height: 90%;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .modal-content {
            position: relative;
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            max-width: 100%;
            max-height: 100%;
            overflow: auto;
          }

          .modal-close {
            position: absolute;
            top: 10px;
            right: 15px;
            color: #aaa;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            z-index: 10001;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
          }

          .modal-close:hover,
          .modal-close:focus {
            color: #000;
            background: rgba(255, 255, 255, 1);
          }

          .modal-image {
            max-width: 100%;
            max-height: 80vh;
            height: auto;
            width: auto;
            display: block;
            margin: 0 auto;
            border-radius: 4px;
          }

          .modal-caption {
            text-align: center;
            margin-top: 10px;
            font-size: 14px;
            color: #666;
            font-style: italic;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          .modal-image {
            animation: zoomIn 0.3s ease;
          }

          @keyframes zoomIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }

          @media (max-width: 768px) {
            .modal-content {
              margin: 20px;
              padding: 15px;
            }
            
            .modal-image {
              max-height: 70vh;
            }
          }
        `;
        document.head.appendChild(style);
      }

      // Показать модальное окно
      function showModal(imageSrc, imageAlt) {
        log('🖼️ Image Preview: Показываем модальное окно', { imageSrc, imageAlt });
        
        const modal = document.getElementById('image-preview-modal');
        const modalImage = modal.querySelector('.modal-image');
        const modalCaption = modal.querySelector('.modal-caption');
        
        modalImage.src = imageSrc;
        modalImage.alt = imageAlt;
        modalCaption.textContent = imageAlt || 'Изображение';
        
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        log('🖼️ Image Preview: Модальное окно показано');
      }

      // Скрыть модальное окно
      function hideModal() {
        log('🖼️ Image Preview: Скрываем модальное окно');
        
        const modal = document.getElementById('image-preview-modal');
        modal.classList.remove('show');
        document.body.style.overflow = '';
        
        log('🖼️ Image Preview: Модальное окно скрыто');
      }

      // Проверка, является ли файл изображением
      function isImageFile(url) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
        const lowerUrl = url.toLowerCase();
        
        log('🖼️ Image Preview: Проверяем URL:', url);
        
        const hasImageExtension = imageExtensions.some(ext => lowerUrl.includes(ext));
        log('🖼️ Image Preview: Имеет расширение изображения:', hasImageExtension);
        
        // Убираем проверку на заканчивание на /, так как Docusaurus добавляет / к URL изображений
        const isNotHtmlPage = !lowerUrl.includes('.html');
        log('🖼️ Image Preview: Не HTML страница:', isNotHtmlPage);
        
        const result = hasImageExtension && isNotHtmlPage;
        log('🖼️ Image Preview: Итоговый результат:', result);
        
        return result;
      }

      // Добавляем стили
      addStyles();
      log('🖼️ Image Preview: Стили добавлены');
      
      // Создаем модальное окно
      const modal = createModal();
      log('🖼️ Image Preview: Модальное окно создано');
      
      // Обработчик клика по ссылкам изображений
      document.addEventListener('click', function(e) {
        log('🖼️ Image Preview: Клик зарегистрирован', e.target);
        
        const link = e.target.closest('a');
        if (!link) {
          log('🖼️ Image Preview: Не найдена ссылка');
          return;
        }
        
        log('🖼️ Image Preview: Найдена ссылка:', link);
        
        const img = link.querySelector('img');
        if (!img) {
          log('🖼️ Image Preview: В ссылке нет изображения');
          return;
        }
        
        log('🖼️ Image Preview: Найдено изображение:', img);
        
        const href = link.getAttribute('href');
        log('🖼️ Image Preview: URL ссылки:', href);
        
        if (!href || !isImageFile(href)) {
          log('🖼️ Image Preview: Это не изображение или нет href');
          return;
        }
        
        log('🖼️ Image Preview: Это изображение!');
        
        const target = link.getAttribute('target');
        log('🖼️ Image Preview: Target ссылки:', target);
        
        if (target === '_blank') {
          log('🖼️ Image Preview: Перехватываем клик и показываем модальное окно');
          e.preventDefault();
          
          showModal(href, img.alt);
        } else {
          log('🖼️ Image Preview: Target не _blank, пропускаем');
        }
      });
      
      // Обработчики закрытия модального окна
      modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target.classList.contains('modal-close')) {
          hideModal();
        }
      });
      
      // Закрытие по Escape
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          hideModal();
        }
      });

      log('🖼️ Image Preview: Инициализация завершена');
    };

    // Запускаем инициализацию
    initImagePreview();

    return () => {
      if (enableLogs) {
        console.log('🖼️ Image Preview: Компонент размонтирован');
      }
    };
  }, []);

  return null; // Этот компонент не рендерит ничего видимого
};

export default ImagePreview;

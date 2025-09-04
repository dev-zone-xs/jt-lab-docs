// Image Preview Modal
(function() {
    'use strict';

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

            /* Анимация для изображения */
            .modal-image {
                animation: zoomIn 0.3s ease;
            }

            @keyframes zoomIn {
                from { transform: scale(0.8); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }

            /* Адаптивность */
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
        console.log('🖼️ Image Preview: Показываем модальное окно', { imageSrc, imageAlt });
        
        const modal = document.getElementById('image-preview-modal');
        const modalImage = modal.querySelector('.modal-image');
        const modalCaption = modal.querySelector('.modal-caption');
        
        modalImage.src = imageSrc;
        modalImage.alt = imageAlt;
        modalCaption.textContent = imageAlt || 'Изображение';
        
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Блокируем скролл
        
        console.log('🖼️ Image Preview: Модальное окно показано');
    }

    // Скрыть модальное окно
    function hideModal() {
        console.log('🖼️ Image Preview: Скрываем модальное окно');
        
        const modal = document.getElementById('image-preview-modal');
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Восстанавливаем скролл
        
        console.log('🖼️ Image Preview: Модальное окно скрыто');
    }

    // Инициализация
    function init() {
        console.log('🖼️ Image Preview: Инициализация начата');
        
        // Добавляем стили
        addStyles();
        console.log('🖼️ Image Preview: Стили добавлены');
        
        // Создаем модальное окно
        const modal = createModal();
        console.log('🖼️ Image Preview: Модальное окно создано');
        
        // Обработчик клика по ссылкам изображений
        document.addEventListener('click', function(e) {
            console.log('🖼️ Image Preview: Клик зарегистрирован', e.target);
            
            const link = e.target.closest('a');
            if (!link) {
                console.log('🖼️ Image Preview: Не найдена ссылка');
                return;
            }
            
            console.log('🖼️ Image Preview: Найдена ссылка:', link);
            
            const img = link.querySelector('img');
            if (!img) {
                console.log('🖼️ Image Preview: В ссылке нет изображения');
                return;
            }
            
            console.log('🖼️ Image Preview: Найдено изображение:', img);
            
            // Проверяем, что это ссылка на изображение
            const href = link.getAttribute('href');
            console.log('🖼️ Image Preview: URL ссылки:', href);
            
            if (!href || !isImageFile(href)) {
                console.log('🖼️ Image Preview: Это не изображение или нет href');
                return;
            }
            
            console.log('🖼️ Image Preview: Это изображение!');
            
            // Проверяем, что это не внешняя ссылка (target="_blank")
            const target = link.getAttribute('target');
            console.log('🖼️ Image Preview: Target ссылки:', target);
            
            if (target === '_blank') {
                console.log('🖼️ Image Preview: Перехватываем клик и показываем модальное окно');
                e.preventDefault(); // Предотвращаем переход по ссылке
                
                // Показываем модальное окно
                showModal(href, img.alt);
            } else {
                console.log('🖼️ Image Preview: Target не _blank, пропускаем');
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
    }

    // Проверка, является ли файл изображением
    function isImageFile(url) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
        const lowerUrl = url.toLowerCase();
        
        console.log('🖼️ Image Preview: Проверяем URL:', url);
        
        // Проверяем расширения файлов
        const hasImageExtension = imageExtensions.some(ext => lowerUrl.includes(ext));
        console.log('🖼️ Image Preview: Имеет расширение изображения:', hasImageExtension);
        
        // Также проверяем, что это не HTML страница (не заканчивается на /)
        const isNotHtmlPage = !lowerUrl.endsWith('/') && !lowerUrl.includes('.html');
        console.log('🖼️ Image Preview: Не HTML страница:', isNotHtmlPage);
        
        const result = hasImageExtension && isNotHtmlPage;
        console.log('🖼️ Image Preview: Итоговый результат:', result);
        
        return result;
    }

    // Запускаем когда DOM готов
    if (document.readyState === 'loading') {
        console.log('🖼️ Image Preview: DOM еще загружается, ждем DOMContentLoaded');
        document.addEventListener('DOMContentLoaded', init);
    } else {
        console.log('🖼️ Image Preview: DOM уже готов, запускаем сразу');
        init();
    }
    
    console.log('🖼️ Image Preview: Скрипт загружен и готов к работе');
    console.log('🖼️ Image Preview: Проверка - скрипт работает!');

})();

// Настройка наблюдателя за скроллом
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // Если элемент появился в области видимости экрана
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, { 
    threshold: 0.3 // Анимация начнется, когда на экране появится 30% блока
});

// Находим все скрытые элементы на странице
const hiddenElements = document.querySelectorAll('.hidden');

// Вешаем наблюдатель на каждый скрытый элемент
hiddenElements.forEach((el) => observer.observe(el));
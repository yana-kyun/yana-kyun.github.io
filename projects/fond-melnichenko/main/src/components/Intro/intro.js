function initIntro() {
    const container = document.querySelector('.js-container-scroll_intro');
    const rotatingImg = document.getElementById('rotating-image');
    const textSections = document.querySelectorAll('.text-section');
    
    
    // Активируем первый текст при загрузке
    textSections[0].classList.add('active');
    document.querySelector('.intro-text-block').classList.add('active');

    const handleScroll = function() {
        const scrollPosition = container.scrollTop;
        const containerHeight = container.clientHeight;
        const maxScroll = container.scrollHeight - containerHeight;
        const scrollProgress = maxScroll > 0 ? scrollPosition / maxScroll : 0;

        // Вращение изображения (2 полных оборота)
        const rotation = scrollProgress * 360;
        rotatingImg.style.transform = `rotate(${rotation}deg)`;
        
        // Изменение прозрачности
        // const opacity = 0.2 + scrollProgress * 0.8;
        // rotatingImg.style.opacity = opacity;

        // Определение активного текстового блока
        textSections.forEach((section, index) => {
            const sectionPosition = index * containerHeight;
            const textBlock = document.querySelectorAll('.intro-text-block');
            
            if (scrollPosition >= sectionPosition - containerHeight/2 && 
                scrollPosition < sectionPosition + containerHeight/2) {
                document.querySelector('.text-section.active')?.classList.remove('active');
                document.querySelector('.intro-text-block.active')?.classList.remove('active');
                section.classList.add('active');
                textBlock[index].classList.add('active');
            }
        });
    };
    
    container.addEventListener('scroll', handleScroll);
    
    // Инициализация при загрузке
    handleScroll();
}
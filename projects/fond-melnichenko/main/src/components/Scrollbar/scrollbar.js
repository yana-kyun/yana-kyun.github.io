let psImg;

let ps;

const scrollbar = () => {
    const containerScroll = document.getElementsByClassName('js-container-scroll');
    
        [...containerScroll].forEach((container, key) => {
            
            if (ps) ps.destroy();
            
            ps = new PerfectScrollbar(container, {
                wheelSpeed: 0.5,
                wheelPropagation: false,
                swipeEasing: true,
                suppressScrollX: true,
            });
        });
    
    const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
            if (entry.contentBoxSize) {
                ScrollTrigger.refresh();
            }
        }
    });

    const childContainers = Array.from(ps.element.children).filter((elem) => !elem.classList.contains('ps__rail-x') && !elem.classList.contains('ps__rail-y'));

    childContainers.forEach(container => {
        resizeObserver.observe(container);
    });

    document.querySelectorAll('.js-img-scroll-xs').forEach(element => {
        new PerfectScrollbar(element, {
            wheelSpeed: 0.5,
            wheelPropagation: true,
            swipeEasing: true,
            suppressScrollY: true,
            suppressScrollX: false,
        });
    });
    
    return ps; // Возвращаем экземпляр
}

const scrollImg = () => {
    console.log(123);
    const containerScroll2 = document.getElementsByClassName('js-container-scroll-img');
    console.log(containerScroll2);
    
        [...containerScroll2].forEach((container, key) => {
            
            psImg = new PerfectScrollbar(container, {
                wheelSpeed: 0.5,
                wheelPropagation: false,
                swipeEasing: true,
                suppressScrollY: true,
                // suppressScrollX: true,
            });
        });
    
}




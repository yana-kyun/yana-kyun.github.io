function initCarousel() {
    // new slider
    const loopSliders = document.querySelectorAll('.js-slider-loop');
    const playlistSliders = document.querySelectorAll('.js-playlist-slider');

    loopSliders.forEach((slider, keySlider) => {
        const swiper = new DraggableSlider(slider, {
            revealId: slider.dataset.revealId ?? null,
            effect: 'slide',
            slidesPerView: 'auto',
            spaceBetween: 24,
        });
    });

    // playlistSliders.forEach((slider, keySlider) => {
    //     const swiper = new DraggableSlider(slider, {
    //         revealId: slider.dataset.revealId ?? null,
    //         effect: 'slide',
    //         slidesPerView: 1,
    //         spaceBetween: 120,
    //     });
    // });

}
initLoopCarousel = (fn) => {
    // new slider
    const loopSliders = document.querySelectorAll('.js-slider-loop');
    const playlistSliders = document.querySelectorAll('.js-playlist-slider');

    loopSliders.forEach((slider, keySlider) => {
        const swiper = new LoopDraggableSlider(slider, {
            revealId: slider.dataset.revealId ?? null,
            effect: 'slide',
            slidesPerView: 'auto',
            spaceBetween: 24,
        });
    });
}

class BaseSlider {

    constructor (slider, params) {
        this.swiper = new Swiper(slider, {
            // Optional parameters
            effect: params.effect ?? 'slide',
            fadeEffect: {
                crossFade: false
            },
            loop: false,
            allowTouchMove: params.allowTouchMove ?? true,
            slidesPerView: params.slidesPerView ?? 1,
            spaceBetween: params.spaceBetween ?? 0,
            pagination: {
                el: slider.querySelector(".slider__pagination"),
            },

            // Navigation arrows
            navigation: {
                nextEl: '.slider__btn-next',
                prevEl: '.slider__btn-prev',
                disabledClass: 'slider__btn_disabled'
            },
            on: {
                slideChange: this.onSlideChange,
            }
        });

        this.revealId = params.revealId;
    }
  
    /**
     * Переопределите этот метод в потомках BaseSlider, чтобы задать уникальное поведение при смене слайда в слайдере
     */
    onSlideChange () {
        console.log('SlideChange');
    }
  
}

class LoopSlider {

    constructor (slider, params) {
        this.swiper = new Swiper(slider, {
            // Optional parameters
            effect: params.effect ?? 'slide',
            fadeEffect: {
                crossFade: false
            },
            loop: true,
            allowTouchMove: params.allowTouchMove ?? true,
            slidesPerView: params.slidesPerView ?? 1,
            spaceBetween: params.spaceBetween ?? 0,
            pagination: {
                el: slider.querySelector(".slider__pagination"),
            },

            // Navigation arrows
            navigation: {
                nextEl: '.slider__btn-next',
                prevEl: '.slider__btn-prev',
                disabledClass: 'slider__btn_disabled'
            },
            on: {
                slideChange: this.onSlideChange,
            }
        });

        this.revealId = params.revealId;
    }
  
    /**
     * Переопределите этот метод в потомках BaseSlider, чтобы задать уникальное поведение при смене слайда в слайдере
     */
    onSlideChange () {
        console.log('SlideChange');
    }
  
}

class DraggableSlider extends BaseSlider {
    constructor (slider, params) {
        super(slider, params);

        this.swiper.setGrabCursor();
    }

    onSlideChange () {
        
    }
}

class LoopDraggableSlider extends LoopSlider {
    constructor (slider, params) {
        super(slider, params);

        this.swiper.setGrabCursor();
    }

    // onSlideChange() {
    //     const slides = document.querySelectorAll('.swiper-slide');
    //     slides.forEach((item) => {
    //         if (item.classList.contains('swiper-slide-active')) {
    //             item.classList.add('vis');
    //         }
    //     })
    //     const slidesVisited = document.querySelectorAll(".swiper-slide.vis").length;
    //     const slideConteiner= document.querySelector('.js-slider-loop');
    //     if (slides.length === slidesVisited) {
    //         slideConteiner.parentNode.parentNode.nextElementSibling.style.display = "block";
    //     }
    // }
}
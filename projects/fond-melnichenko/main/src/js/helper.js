"use strict";
/*Получить меню курса*/
function getNavigation() {
    var nav = document.querySelector('#contents_old');
    var navItems = nav.querySelectorAll('.slide-item');
    var data = [];
    navItems.forEach(function (item) {
        var status = true;
        if (item.classList[2] === undefined) {
            status = false;
        }
        data.push({
            text: item.innerText,
            disable: status,
            postion: item.classList[1]
        })
    });
    return data;
}

/*Получить название слайда*/
function getSlideTitle() {
    return document.querySelector('#slide_title').innerText;
}

/*Получить позицию слайда*/
function getSlidePosition() {
    var couner = document.querySelector('#p_position_slide');
    var currentSlide = Number(couner.querySelector('.cl-value').innerText);
    var totalSlide = Number(couner.querySelector('.cl-total').innerText);

    return {
        current: currentSlide,
        total: totalSlide
    }
}

/*Получить позицию фреймов*/
function getFramePosition() {
    var couner = document.querySelector('#p_position_frame');
    var currentSlide = Number(couner.querySelector('.cl-value-frame').innerText);
    var totalSlide = Number(couner.querySelector('.cl-total-frame').innerText);

    return {
        current: currentSlide,
        total: totalSlide
    }
}

/*Переход к нужному фрейму*/
function gotoFrame(sFrameId, event) {
    if (sFrameId != "") {
        var jxFrame = CL.axSlides.find("frame[id='" + sFrameId + "']");
        var jxSlide = jxFrame.parents("slide:first");
        var sSlideId = jxSlide.attr("id");
        if (jxSlide.attr("id") != CLZ.sCurrentSlideId) {
            CL.Open.Slide({
                slideid: sSlideId,
            });
            if (!CLF[sFrameId].bIsFirst) {
                CLF[sFrameId].Start();
            }
        } else {
            CLF[sFrameId].Start();
        }
    }
}

/*Cледующий слайд*/
function nextSlide() {
    document.querySelector('#next').querySelector('img').click();
}

/*Предыдущий слайд*/
function prevSlide() {
    document.querySelector('#prev').querySelector('img').click();
}

/*Отслеживание перемещения по слайдам*/
function moveSlide(callback) {
    // $('.cl-position-frame').on('DOMSubtreeModified', function() {
    //     callback.fn()
    // });

    const targetNode = document.querySelector('.cl-position-frame');
    
    if (!targetNode) {
        console.error('Element not found: .cl-position-frame');
        return;
    }

    const config = { childList: true, subtree: true };

    const observer = new MutationObserver(function(mutationsList) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                callback.fn();
            }
        }
    });

    observer.observe(targetNode, config);

}


/**
 * Отобразить спрятанный контент
 * @param {*} hiddenId Номер идентификатора элемента (data-hidden-id)
 * @param {*} options 
 */
function revealHiddenContent(hiddenId, options) {
    const myOptions = {
        useCLV: true,
    };

    for (const key in options) {
        myOptions[key] = options[key];
    }

    const hiddenElements = document.querySelectorAll('.js-hide-reveal');
    const imgLoaded = Array.from(document.images).reduce((accumulator, current) => accumulator && current.complete, true);

    hiddenElements.forEach(element => {
        if (String(hiddenId) === String(element.dataset.hiddenId)) {
            element.classList.remove('hidden');
        }
    });

    if (myOptions.useCLV) {
        if (typeof CLV !== 'undefined') {
            CLV.oGlobal['revealedElements' + getFramePosition().current + hiddenId] = true;
        }
    }
}

function hideContent(hiddenId, options) {
    const myOptions = {
        useCLV: true,
    };

    for (const key in options) {
        myOptions[key] = options[key];
    }

    const hiddenElements = document.querySelectorAll('.js-hide-reveal');
    setTimeout(() => {
        hiddenElements.forEach(element => {
            if (String(hiddenId) === String(element.dataset.hiddenId)) {
                ps.element.scrollTop -= element.offsetHeight;
                element.classList.add('hidden');
            }
        });

        if (myOptions.useCLV) {
            if (typeof CLV !== 'undefined') {
                CLV.oGlobal['revealedElements' + getFramePosition().current + hiddenId] = false;
            }
        }
    }, 1000);
}

function scrollToContent(scrollId, options) {
    const myOptions = {
        offset: 73,
    };

    for (const key in options) {
        myOptions[key] = options[key];
    }

    const scrollToElement = document.querySelector(`.js-hide-reveal[data-hidden-id="${scrollId}"]`);

    let elem = scrollToElement;
    let offsetTop = elem.offsetTop;

    while (!elem.classList.contains('js-container-scroll')) {
        elem = elem.offsetParent;
        offsetTop += elem.offsetTop;
    }

    gsap.to('.js-container-scroll', {
        duration: 1,
        scrollTop: offsetTop - myOptions.offset,
    });
}

function scrollToElement(elem, duration, delay) {
    startPreloadImages(() => {
        let offsetTop = elem.offsetTop;

        while (!elem.classList.contains('js-container-scroll')) {
            elem = elem.offsetParent;
            offsetTop += elem.offsetTop;
        }
        gsap.to('.js-container-scroll', {
            duration: duration,
            scrollTop: offsetTop - 100,
            delay: delay,
            onStart: () => {
                // ScrollTrigger.getAll().forEach(trg => {
                //     trg.disable();
                // });
            },
            onComplete: () => {
                // ScrollTrigger.getAll().forEach(trg => {
                //     trg.enable();
                // });
            }
        });
    });
}

function scrollToLastAutoScrollElement(options = {}) {
    const myOptions = {
        offsetFromBottom: 150, // Отступ от низа
        duration: 1.2,
        container: '.js-container-scroll',
        target: '.js-auto-scroll',
        ease: 'sine.inOut',
        smoothScrolling: true,
        minVisibleTop: 100, // Минимальный отступ сверху (чтобы верх элемента не уходил за край)
    };

    Object.assign(myOptions, options);

    const container = document.querySelector(myOptions.container);
    if (!container) {
        console.warn('Контейнер для скролла не найден');
        return;
    }

    const targetElements = container.querySelectorAll(myOptions.target);
    if (targetElements.length === 0) {
        console.warn('Элементы для скролла не найдены');
        return;
    }

    const lastTarget = targetElements[targetElements.length - 1];
    const targetRect = lastTarget.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const containerHeight = container.clientHeight;
    const targetHeight = targetRect.height;

    // 1. Рассчитываем позицию, чтобы верх элемента был на `offsetFromBottom` выше низа
    let scrollPosition = container.scrollTop + (targetRect.top - containerRect.top) - (containerHeight - myOptions.offsetFromBottom);

    // 2. Если элемент не помещается, корректируем скролл, чтобы верх был виден
    if (targetHeight > containerHeight - myOptions.minVisibleTop) {
        scrollPosition = container.scrollTop + (targetRect.top - containerRect.top) - myOptions.minVisibleTop;
    }

    // Автонастройка длительности
    if (myOptions.smoothScrolling) {
        const distance = Math.abs(container.scrollTop - scrollPosition);
        myOptions.duration = Math.min(1.8, Math.max(0.6, distance / containerHeight * 1.5));
    }

    // GSAP анимация
    gsap.to(container, {
        scrollTop: scrollPosition,
        duration: myOptions.duration,
        ease: myOptions.ease,
        onStart: () => { container.style.willChange = 'scroll-position'; },
        onComplete: () => { container.style.willChange = 'auto'; },
        overwrite: 'auto'
    });
}

function showContant(idx) {
    let items = document.querySelectorAll('.js-hidden-contant')

    items.forEach((item, index) => {
        if(item.getAttribute('data-hidden-contant') == idx) {
            item.classList.remove('vis-hidden')
        }
    })
}

function repeatRoad() {
    const repeatButton = document.querySelector('.js-btn-repeat-road');
    const imgDefault = document.querySelectorAll('.js-tile-default');
    const imgReceived = document.querySelectorAll('.js-tile-received');
    const infoHidden = document.querySelectorAll('.js-tile-info');
    const imgUnlocked = document.querySelector('.js-tile-unlocked'); // выбираем только 1-й элемент
  
    function repeat() {
      eventBus.$emit('years', 16);
      imgDefault.forEach(function(item, idx) {
        if (idx > 0) {
          item.classList.remove('hide');
        }
      });
  
      imgReceived.forEach(function(item) {
          item.classList.add('hide');
      });
  
      imgUnlocked.classList.remove('hide');
  
      infoHidden.forEach(function(item, idx) {
        if (idx > 0) {
          item.classList.add('hide');
        }
      });
      
      scrollToContent(1);
    }
    
    repeatButton.addEventListener('click', repeat);
}


let startPreloadImages = (fu) => {

	const images = Array.from(document.images);

	let unloadedImgPromises = [];

	images.forEach(img => {
		if (!img.complete) {
			let newImgPromise = new Promise((resolve, reject) => {
				img.addEventListener('load', (e) => {
					resolve();
				});
			});

			unloadedImgPromises.push(newImgPromise);
		}
	});

	Promise.all(unloadedImgPromises).then(() => {
		fu();
	})
}
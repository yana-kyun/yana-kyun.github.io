const fastGsapAnimate = (markerShow) => {
  /**
   * Анимация блоков
   */

  let animateBlock = {
    scroller: (item) => {
      const animation = item.getAttribute('data-animation');

      item.classList.remove('invisible');
      item.classList.add('animate__animated', animation);
    },
  }

  /**
   * Поиск скроллеров и тригеров в доме
   */

  gsap.registerPlugin(ScrollTrigger);

  /**
   * Тригер для срабатывания анимаций
   */
  const triggers = document.querySelectorAll('.js-trigger');

  /**
   * Блоки в которых содержится анимация
   */
  const scrollContainer = document.querySelectorAll('.js-scroller-container');

  triggers.forEach((trigger, keyTrigger) => {
    /** Условие поиска */
    const elemAnimation = scrollContainer[keyTrigger].querySelectorAll('.js-scroller');

    const animate = gsap.timeline({
      defaults:
      {
        duration: 1,
        ease: "elastic(2.5, 1)"
      },
      scrollTrigger: {
        scroller: '.js-container-scroll',
        start: "top 70%",
        end: "bottom bottom",
        trigger: trigger,
        pin: false,
        markers: markerShow,
        onEnter: (e) => {
          //console.log(e)
          elemAnimation.forEach((item, key) => {
            setTimeout(() => {
              animateBlock.scroller(item);
            }, 500 * key)
          });
        }
      }
    })

  })
}


gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

let scrollAnimateStore = []

let updateGsapCenter = () => {

  /** Хранилище триггеров */

  if (scrollAnimateStore.length > 0) {
      console.log('not empty')
      scrollAnimateStore.forEach(item => {
          item.scrollTrigger.kill()
      })

      scrollAnimateStore = []
  }
  else {
      console.log('empty')
  }

  document.querySelectorAll('.js-refresh-gsap').forEach(item => {
      let refresh = item.querySelectorAll('.js-scroller')

      refresh.forEach(refreshes => {
          let animate = refreshes.dataset.animation
          refreshes.classList.remove('animate__animated')
          refreshes.classList.remove(animate)
          refreshes.classList.add('invisible')

      })
  })
}

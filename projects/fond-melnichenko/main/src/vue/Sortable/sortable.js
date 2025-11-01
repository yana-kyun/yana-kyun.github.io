Vue.component("vSortable", {
  template: "#v-sortable-template",
  props: {
    /*Хранилище вопросов*/
    questionStorage: Object,
    /*Перемешивать ли массив*/
    random: Boolean,
    standalone: Boolean,
    /*Продолжать ли показ слайда после конца теста*/
    continueSlide: Boolean,
    maxAttempts: Number,
    endPractice: Function,
    correctPractice: Function,
  },
  data: function () {
    return {
      //Кнопка сброса
      btnReset: false,
      //Кнопка принять
      btnAccept: false,
      // Узнать ответ
      btnShowCorrect: false,
      //Обратная связь
      feedbackShow: false,
      showCorrect: false,
      counterAttempt: 1,
      shuffleOnRefresh: 0,
      showFeedbackText: false,
      lastScrollTop: 0,  // Для фиксации позиции скролла
      isDragging: false, // Флаг перетаскивания
      ps: null,          // Экземпляр PerfectScrollbar
      lastScrollTop: 0,   // Последняя позиция скролла
      scrollLockFunc: null, // Функция блокировки скролла
    };
  },
  mounted: function () {
    const container = this.$el.closest('.js-container-scroll');
    if (container && !container._ps) {
        this.ps = new PerfectScrollbar(container, {
            wheelSpeed: 0.5,
            wheelPropagation: false,
            swipeEasing: true,
        });
        container._ps = this.ps; // Сохраняем в элемент
    } else if (container?._ps) {
        this.ps = container._ps; // Используем существующий
    }

    this.sortableInit();
  },
  computed: {
    /*Перемешиваем массив*/
    sortArray: function () {
      this.shuffleOnRefresh;
      return this.shuffling(this.questionStorage.sortable);
    },
  },
  methods: {
    scrollToFeedback(options = {}) {
        // Находим элемент с обратной связью
        const feedbackElement = this.$el.querySelector('.js-scroll-feedback');
        
        if (!feedbackElement) {
            console.warn('Element with class .js-scroll-feedback not found');
            return;
        }

        // Параметры скролла по умолчанию
        const scrollOptions = {
            offset: 300, // Отступ сверху
            duration: 2, // Длительность анимации
            container: '.js-container-scroll', // Контейнер для скролла
            ...options // Переопределение параметров из аргументов
        };

        // Вычисляем итоговую позицию скролла
        const container = document.querySelector(scrollOptions.container);
        if (!container) {
            console.warn(`Container ${scrollOptions.container} not found`);
            return;
        }

        const feedbackRect = feedbackElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        // Позиция элемента относительно контейнера
        const scrollPosition = feedbackRect.top - containerRect.top + container.scrollTop - scrollOptions.offset;

        // Анимация скролла
        gsap.to(container, {
            duration: scrollOptions.duration,
            scrollTop: scrollPosition,
            ease: 'power2.out' // Плавное замедление в конце
        });
    },
    /*Метод перемешиваем массив*/
    shuffling: function (data) {
      var arr = [];
      arr = data.slice();
      if (this.random) {
        // console.log('this.random');
        /*перемешиваем вопросы*/
        arr.sort(function () {
          return Math.random() - 0.5;
        });
      }
      return arr;
    },

    // Функция блокировки (аналогично модалке)
    lockScroll() {
        if (!this.ps) return;
        
        this.lastScrollTop = this.ps.element.scrollTop;
        this.scrollLockFunc = () => {
            this.ps.element.scrollTop = this.lastScrollTop;
        };
        
        // Вешаем обработчик
        this.ps.element.addEventListener('ps-scroll-y', this.scrollLockFunc);
    },

    // Разблокировка
    unlockScroll() {
        if (!this.ps || !this.scrollLockFunc) return;
        this.ps.element.removeEventListener('ps-scroll-y', this.scrollLockFunc);
    },

    // Обновлённый sortableInit
    sortableInit() {
        const th = this;

        // Ждём загрузки всех изображений внутри .js-sort-item
        Promise.all(
            Array.from(document.querySelectorAll(".js-sort-item img")).map(img => 
                img.complete ? Promise.resolve() : new Promise(resolve => {
                    img.onload = resolve;
                    img.onerror = resolve; // На случай ошибки загрузки
                })
            )
        ).then(() => {
            // Теперь точно знаем, что контент загружен
            const heights = $(".js-sortable .js-sort-item").map(function() {
                return $(this).outerHeight(true);
            }).get();
            
            const maxHeight = Math.max(...heights);
            $(".sortable__title, .js-sort-item").css("min-height", maxHeight + "px");
        });

        // Инициализация Sortable
        $(".js-sort-block").sortable({
            axis: "y",
            handle: ".js-sort",
            start: function(event, ui) {
                th.lockScroll(); // Блокируем скролл
            },
            stop: function(event, ui) {
                th.unlockScroll(); // Разблокируем
                th.btnAccept = true;
            }
        });
    },

    //Метод проверки верного порядка
    checkOrder: function () {
      var th = this;
      var pId = 0;
      var correct = 0;
      var $items = $(".js-sortable").find(".js-sort-item");

      $items.each(function (key, sort) {
        var id = Number($(sort).attr("data-id"));
        var cId = th.sortArray[id].order;

        if (key + 1 === cId) {
          correct++;
          $(sort).addClass("correct");
        } else {
          $(sort).addClass("incorrect");
        }
      });

      $(".js-sort-block").sortable("disable");

      if (correct === $items.length) {
          th.showFeedbackText = true;
        return true;
        
      } else {
          th.showFeedbackText = false;
        return false;
      }
    },

    //Метод проверки верного порядка
    accept: function () {
        this.btnAccept = false;
        this.feedbackShow = true;
        this.counterAttempt++;
        
        if (this.checkOrder() == true) {
            this.endPractice();
            this.correctPractice();
        } else if (this.checkOrder() == false && this.counterAttempt > this.maxAttempts) {
            this.btnShowCorrect = true;
        } else {
            this.btnReset = true;
        }
        setTimeout(() => {
            this.scrollToFeedback();
        }, 200);
    },
    
    sortCorrect: function() {
        this.showCorrect = true; // Показываем блок с правильной сортировкой
        this.btnShowCorrect = false;
        // Если нужно синхронизировать высоты (опционально)
        this.$nextTick(() => {
            const titles = this.$el.querySelectorAll('.sortable__title');
            const items = this.$el.querySelectorAll('.sortable__item');
            
            titles.forEach((title, index) => {
                if (items[index]) {
                    // Выравниваем высоты
                    const heights = $(".sortable__body .sortable__item").map(function() {
                        return $(this).outerHeight(true);
                    }).get();
                    const maxHeight = Math.max(...heights);
                    $(".sortable__body .sortable__item").css("min-height", maxHeight + "px");
                }
            });

            items.forEach((item) => {
                item.classList.add('correct');
            });
        });
        this.endPractice();
    },

    //Метод перезапуска вопроса
    refresh: function () {
      this.btnReset = false;
      this.feedbackShow = false;
      this.btnShowCorrect = false;

      this.shuffleOnRefresh++;

      $(".js-sort-block").sortable("cancel");
      $(".js-sort-block").sortable("enable");
      $(".js-sort-item").removeClass("correct").removeClass("incorrect");

    },

    /*Метод перезапись практики*/
    resetDraggable: function () {
      this.feedbackShow = false;

      //Ждем пока добавятся новые элементы если такие есть
      var th = this;
      setTimeout(function () {
        //Инициализируем объекты
        th.sortableInit();
      }, 100);
    },
  },

    beforeDestroy() {
        this.unlockScroll(); // Снимаем блокировку
    },

});

Vue.component('vDragAndDrop', {
    template: '#v-drag-and-drop-template',
    props: {
        /*Хранилище вопросов*/
        questionStorage: Array,
        /*Перемешивать ли массив*/
        random: Boolean,
        /*Проверять ли выбранный ответ*/
        checkAnswer: Boolean,
        correctPractice: Function,
        endPractice: Function,      // Функция завершения практики
    },
    data: function () {
        return {
            //Текущий вопрос
            cQuestion: 0,
            //Правильно отвеченых вопросов
            corrQuestion: 0,
            //Кнопка продолжить
            btnNext: false,
            //Кнопка сброса
            btnReset: false,
            //Кнопка принять
            btnAccept: false,
            //Блокировка практики
            draggableDisable: false,
            //Обратная свзяь
            feedbackShow: false,
        }
    },
    computed: {
        /*Перемешиваем массив*/
        dropArray: function () {
            return this.shuffling(this.questionStorage);
        }
    },
    methods: {
        /*Метод перемешиваем массив*/
        shuffling: function (data) {
            if (this.random) {
                /*перемешиваем вопросы*/
                data.sort(function () {
                    return Math.random() - 0.5;
                });

                data.forEach(function (item, key) {
                    /*перемешиваем ответы вопроса*/
                    item.draggable.sort(function () {
                        return Math.random() - 0.5;
                    });
                    /*перемешиваем вопросы*/
                    item.droppable.sort(function () {
                        return Math.random() - 0.5;
                    });
                })
            }
            return data;
        },
        /*Метод Инициализации*/
        draggableInit: function () {
            var th = this;
            var draggable = $('.js-draggable');
            var droppableItem = $('.js-droppable-item');
            var droppable = '.js-droppable';
            var container = '.js-draggable-container';
            // Инициализируем перетаскиваемый обьект
            draggable.draggable({
                containment: ".dragAndDrop__body",
                stop: function (e, ui) {
                    /*Притягивает блок*/
                    $(this).css({
                        left: '',
                        top: '',
                    });
                },
                revert: function (event, ui) {
                    /*возвращает елемент наместо*/
                    $(this).data("uiDraggable").originalPosition = {
                        top: 0,
                        left: 0
                    };
                    return !event;
                }
            });
            // Инициализируем обьект куда перетаскиваем
            droppableItem.droppable({
                accept: draggable,
                activeClass: 'active',
                hoverClass: 'drop-here',
                over: function(e, ui) {
                  console.log(e.target)
                },
                drop: function (e, ui) {
                    /*проверка существует ли елемент*/
                    if (e.target.firstChild !== null) {
                        /*Возвращает елемент на свое место*/
                        $($(e.target).find(droppable)[0].firstChild).appendTo(container);
                    }
                    /*Вставляет елемент внутрь*/
                    ui.draggable.appendTo($(this).find(droppable));

                    /*Показываети  скрывает кнопку принять*/
                    if ($(container).find(draggable).length === 0) {
                        th.btnAccept = true;
                    } else {
                        th.btnAccept = false;
                    }
                },
            });
        },
        /*Метод перезапуск практики*/
        reset: function () {
            var droppable = $('.js-droppable');
            var draggable = $('.js-draggable');
            var container = '.js-draggable-container';

            draggable.draggable("enable");

            /*Возвращаем елементы на свои места*/
            droppable.each(function (key, item) {
                $(item).find(draggable).appendTo(container);
                $(item).removeClass('correct');
                $(item).removeClass('incorrect');
            });
            this.btnNext = false;
            this.btnReset = false;
        },
        /*Метод перехода к сл вопросу*/
        next: function () {
            //Проверям номер текущего вопроса и если он не последний выводим сл.
            if (this.cQuestion < this.dropArray.length - 1) {
                //Переход к сл вопросу
                this.cQuestion++;
            } else {
                //Показываем обратную свзяь
                this.feedbackShow = true
            }

            this.btnNext = false;

            //Возвращаем элементы на свои места
            this.reset();

            var th = this;

            //Ждем пока добавятся новые елементы если такие есть
            setTimeout(function () {
                //Инициализируем обьекты
                th.draggableInit();
            }, 100);
        },
        /*Метод проверки правильности ответов*/
        accept: function () {
            var droppable = $('.js-droppable');
            var draggable = $('.js-draggable');
            var counter = 0;

            /*подсчет правельных ответов*/
            droppable.each(function (key, item) {
                var dropID = $(item).attr('data-id');
                var dragID = $(item).find(draggable).attr('data-id');
                if (dragID === dropID) {
                    $(item).addClass('correct');
                    counter++
                } else {
                    $(item).addClass('incorrect');
                }
            });

            draggable.draggable("disable");

            this.btnAccept = false;

            if (counter === droppable.length) {
                this.corrQuestion++;
            }

            if (this.checkAnswer) {
                this.btnAccept = false;
                this.btnNext = true;
                if (counter !== droppable.length) {
                    this.btnReset = true;
                }
            } else {
                this.reset();
                this.next();
            }
        },
        /*Метод перезапска практики*/
        resetDraggable: function () {
            this.corrQuestion = 0;
            this.cQuestion = 0;
            this.feedbackShow = false;

            //Ждем пока добавятся новые елементы если такие есть
            var th = this;

            this.$nextTick(function () {
                //Инициализируем обьекты
                th.draggableInit();
            });
        },
        /*Перехода к следующему слайду*/
        nextSlide: function () {
            nextSlide();
        },
    },
    mounted: function () {
        this.draggableInit();
    },
});

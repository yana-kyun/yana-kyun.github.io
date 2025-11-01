Vue.component('vDraggableSides', {
    template: '#v-draggable-sides-template',
    props: {
        /*Хранилище вопросов*/
        questionStorage: Array,
        /*Перемешивать ли массив*/
        random: Boolean,
        /*Проверять ли выбранный ответ*/
        checkAnswer: Boolean,
    },
    data: function () {
        return {
            //Текущий вопрос
            cQuestion: 0,
            //Правильно отвеченых вопросов
            corrQuestion: 0,
            //Текущий позиция ответа
            cPosition: '',
            //Кнопка продолжить
            btnNext: false,
            //Кнопка продолжить
            draggableDisable: false,
            //Обратная свзяь
            feedbackShow: false,
        }
    },
    computed: {
        /*Перемешиваем массив*/
        draggableArray: function () {
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
            }
            return data;
        },
        //Метод инициализации draggable
        draggableInit: function () {
            var th = this;
            //Инициализируем draggable
            $(".draggable-sides__text").draggable({
                //Смещение только по оси X
                axis: "x",
                snap: ".draggable-sides__item",
                containment: ".draggable-sides__container",
                snapMode: "inner",
                //Событие стоп
                stop: function (event, ui) {
                    //Получаем элемент на которые нужно переносить
                    var snapped = $(this).data('ui-draggable').snapElements;

                    //Получаем элемент на котором было остановленно перемещение
                    var snappedTo = $.map(snapped, function (element) {
                        if (ui.position.left > 50 || ui.position.left < -50) {
                            return element.snapping ? element : null;
                        }
                    });

                    //Возвращаем элемент наместо если он никуда не попал
                    if (snappedTo.length !== 0) {

                        if ($(snappedTo[0].item).index() === 0) {
                            th.cPosition = 'left'
                        } else {
                            th.cPosition = 'right'
                        }

                        if (th.draggableArray[th.cQuestion].correct === th.cPosition) {
                            th.corrQuestion++
                        }

                        if (th.checkAnswer) {
                            //Показать кнопку продолжить
                            th.btnNext = true;

                            //Заблокировать перетаскивание
                            th.draggableDisable = true;
                        } else {
                            th.nextQuestion();
                        }

                    }

                    //Возвращаем елемент на свое место
                    $('.draggable-sides__text').css('left', 0);
                }
            });
        },
        /*Метод перехода к сл вопросу*/
        nextQuestion: function () {
            //Проверям номер текущего вопроса и если он не последний выводим сл.
            if (this.cQuestion < this.draggableArray.length - 1) {
                //Переход к сл вопросу
                this.cQuestion++;
            } else {
                //Показываем обратную свзяь
                this.feedbackShow = true
            }

            //Скрываем кнопку продолжить
            this.btnNext = false;

            //Разблокировать перетаскивание
            this.draggableDisable = false;
        },
        /*Перезапуск тестирования*/
        resetDraggable: function () {
            //Текущий вопрос
            this.cQuestion = 0;
            //Правильно отвеченых вопросов
            this.corrQuestion = 0;
            //Обратная свзяь
            this.feedbackShow = false;
        },
        /*Переход к сл. слайду*/
        nextSlide: function () {
            nextSlide();
        }
    },
    mounted: function () {
        this.draggableInit();
    },
});

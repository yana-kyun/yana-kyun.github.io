Vue.component('vPuzzlePractice', {
    template: '#v-puzzle-practice-template',
    props: {
        /*Хранилище вопросов*/
        date: Object,
    },
    data: function () {
        return {
            practiceHeight: '',
            counterEl: 0,
        }
    },
    computed: {
        elemArray: function () {
            return this.date.elemStorage;
        },
        containerArray: function () {
            return this.date.containerStorage;
        },

        posAbsolute: function() {
            return (position) => {
                // if(window.screen.width >= 719 && position) {
                    return position
                // }
                // return
            }
        }
    },
    methods: {
        hideModal: function (idx) {
            this.$refs.jsModal[idx].classList.add('hide')
        },
        showModal: function (idx) {
            this.$refs.jsModal[idx - 1].classList.remove('hide')
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
                
                },
                drop: function (e, ui) {
                    /*проверка существует ли елемент*/
                    if (e.target.firstChild !== null ) {
                        if (e.target.getAttribute('data-id') == ui.draggable[0].getAttribute('data-id')) {
                            ui.draggable[0].classList.add('hide');
                            e.target.classList.add('pointer');
                            
                            th.elemArray.forEach((element, idx) => {
                                if(element.id==e.target.getAttribute('data-id')) {
                                    element.open = true;
                                    th.counterEl++;
                                    th.showModal(element.id);
                                    if (th.counterEl == th.elemArray.length) {
                                        th.$emit('complete');
                                    }
                                }
                            });
                        } else {
                            $($(e.target).find(droppable)[0].firstChild).appendTo(container);
                        }
                    }
                },
            });
        },
    },
    mounted() {
        this.$nextTick(() => {
            startPreloadImages(() => {
                this.practiceHeight = this.$refs.jsPuzzleMain.clientHeight;
            });
            
        });
        this.draggableInit();
    }
});

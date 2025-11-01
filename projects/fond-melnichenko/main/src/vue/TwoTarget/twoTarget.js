Vue.component("vTwo", {
    template: "#v-two-template",
    props: {
        taskText: Object,
        feedback: Object,
        answersStorage: Array,
        random: Boolean,
        explanation: Object,
        endPractice: Function,
        nextBtnFunc: Function,
        correctPractice: Function,
    },
    data: function () {
        return {
            isSubmitted: false,
            attemptsLeft: 3,
            showFeedback: false,
            showExplanation: false,
            showTryAgain: false
        };
    },
    computed: {
        feedbackText() {
            return this.isAllCorrect ? this.feedback.textCorrect : this.feedback.textIncorrect;
        },
        isAllCorrect() {
            return this.answersStorage.every(column => 
                column.options.some(option => option.selected && option.correct)
            );
        },
        hasSelection() {
            return this.answersStorage.every(column => 
                column.options.some(option => option.selected)
            );
        }
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
                offset: 100, // Отступ сверху
                duration: 1, // Длительность анимации
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

        selectOption(columnIndex, optionIndex) {
            // Сбрасываем выбор в колонке перед установкой нового
            this.answersStorage[columnIndex].options.forEach(option => {
                option.selected = false;
            });
            this.answersStorage[columnIndex].options[optionIndex].selected = true;
        },

        acceptAnswer() {
            if (!this.hasSelection) return;
            
            this.isSubmitted = true;
            this.attemptsLeft--;
            
            this.showFeedback = true;
            
            if (this.isAllCorrect) {
                this.showExplanation = true;
                this.showTryAgain = false;
                this.endPractice();
                this.correctPractice();
            } else if (this.attemptsLeft === 0) {
                this.showExplanation = true;
                this.showTryAgain = false;
                this.endPractice();
            } else {
                this.showTryAgain = true;
            }

            setTimeout(() => {
                this.scrollToFeedback();
            }, 300);
        },

        resetTask() {
            this.isSubmitted = false;
            this.showFeedback = false;
            this.showTryAgain = false;
            
            // Сбрасываем выбранные ответы
            this.answersStorage.forEach(column => {
                column.options.forEach(option => {
                    option.selected = false;
                });
            });
        },

    }
});
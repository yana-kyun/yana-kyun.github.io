Vue.component('vTestSingle', {
    template: '#v-test-single-template',
    
    props: {
        questionText: {
            type: String,
            default: "", // если пропс не передан, будет пустая строка
        },
        options: Array,
        correctFeedbackText: String,
        incorrectFeedbackText: String,
        feedbackImage: String,
        explanation: String,
        maxAttempts: {
            type: Number,
            default: 1
        },
        endPractice: Function,
        correctPractice: Function,
        showHint: { type: Boolean, default: true },
        showQuestionText: { type: Boolean, default: true },
        hintText: {type: String, default: "Выберите один ответ" }
    },
    data() {
        return {
            selectedIndex: null,
            showFeedback: false,
            isCorrect: false,
            attemptsLeft: this.maxAttempts
        }
    },
    computed: {
        showExplanation() {
            return this.showFeedback && (this.isCorrect || this.attemptsLeft === 0)
        },
        showSubmitButton() {
            return !this.showFeedback && this.attemptsLeft > 0 && this.selectedIndex !== null
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
                offset: 300, // Отступ сверху
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

        checkAnswer() {
            this.showFeedback = true;
            this.isCorrect = this.options[this.selectedIndex].correct;

            setTimeout(() => {
                this.scrollToFeedback();
            }, 300);
            
            if (this.isCorrect) {
                this.endPractice();
                this.correctPractice();
            } else if (this.attemptsLeft === 1) {
                this.endPractice();
            }

            if (!this.isCorrect) {
                this.attemptsLeft--;
            }
        },
        resetSelection() {
            this.selectedIndex = null;
            this.showFeedback = false;
        },
        nextSlide() {
            nextSlide();
        },
        // Метод для определения видимости radio-кнопки
        showRadio(index) {
            // Всегда показываем radio, но делаем его прозрачным при необходимости
            return true;
        }
    }
});
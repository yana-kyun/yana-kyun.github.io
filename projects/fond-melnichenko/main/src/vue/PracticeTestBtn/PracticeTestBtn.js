Vue.component('vTestBtnPractice', {
    template: '#v-test-btn-practice-template',
    
    props: {
        questionText: {
            type: String,
            default: "", // если пропс не передан, будет пустая строка
        },
        questions: Array,
        feedbackImage: String,
        correctFeedbackText: String,
        incorrectFeedbackText: String,
        explanation: String,
        maxAttempts: {
            type: Number,
            default: 1
        },
        endPractice: Function,
        correctPractice: Function,
        showHint: { type: Boolean, default: true },
        showQuestionText: { type: Boolean, default: true },
        hintText: {type: String, default: "Выберите один ответ" },
        countColLg: {type: Number, default: 2},
        countColXs: {type: Number, default: 1}
    },
    data() {
        return {
            selectedIndex: null,
            selectedIndexArray: [],
            showFeedback: false,
            checkedQuestion: [],
            isCorrect: [],
            isCorrectTest: false,
            counterCorrect: 0,
            attemptsLeft: this.maxAttempts,
            counterQuestion: 0,
        }
    },
    computed: {
        showExplanation() {
            return this.showFeedback && (this.isCorrectTest || this.attemptsLeft === 0)
        },
        showSubmitButton() {
            return !this.checkedQuestion[this.counterQuestion] && this.attemptsLeft > 0 && this.selectedIndex !== null
        },
        testGridStyle() {
            if(window.screen.width >= 719) {
                return `grid-template-columns: repeat(${this.countColLg}, 1fr)`
            } else {
                return `grid-template-columns: repeat(${this.countColXs}, 1fr)`
            }
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
            this.selectedIndexArray.push(this.selectedIndex)
            this.checkedQuestion.push(true);
            this.isCorrect.push(this.questions[this.counterQuestion].options[this.selectedIndex].correct);

            
            
            if (this.isCorrect[this.counterQuestion]) {
                this.counterCorrect++
            }
            if (this.counterQuestion >= this.questions.length - 1) {
                if (this.counterCorrect == this.questions.length) {
                    this.endPractice();
                    this.correctPractice();
                    this.isCorrectTest = true;
                } else if (this.attemptsLeft <= 1) {
                    this.endPractice();
                }
                if (this.attemptsLeft > 0) {
                    this.attemptsLeft--;
                }
                this.showFeedback = true;
                setTimeout(() => {
                    this.scrollToFeedback();
                }, 300);
            }
        },
        resetSelection() {
            scrollToContent('js-test-btn-practice-top');
            this.counterCorrect = 0
            this.counterQuestion = 0;
            this.selectedIndex = null;
            this.selectedIndexArray = [];
            this.checkedQuestion = [];
            this.isCorrect = [];
            this.showFeedback = false;
        },
        nextSlide() {
            nextSlide();
        },
        // Метод для определения видимости radio-кнопки
        showRadio(index) {
            // Всегда показываем radio, но делаем его прозрачным при необходимости
            return true;
        },

        nextQuestion() {
            this.counterQuestion++;
            this.selectedIndex = null;
            setTimeout(() => {
                scrollToContent('js-test-btn-practice-question' + this.counterQuestion);
            }, 300);
        }
    }
});
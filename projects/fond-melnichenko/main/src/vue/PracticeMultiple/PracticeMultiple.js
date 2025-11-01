Vue.component('vTestMultiple', {
    template: '#v-test-multiple-template',
    
    props: {
        questionText: String,
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
        hintText: { type: String, default: 'Выберите один или несколько вариантов'}
    },
    data() {
        return {
            selectedIndices: [], // Теперь храним массив выбранных индексов
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
            return !this.showFeedback && this.attemptsLeft > 0 && this.selectedIndices.length > 0
        }
    },
    methods: {
        scrollToFeedback(options = {}) {
            const feedbackElement = this.$el.querySelector('.js-scroll-feedback');
            
            if (!feedbackElement) {
                console.warn('Element with class .js-scroll-feedback not found');
                return;
            }

            const scrollOptions = {
                offset: 300,
                duration: 1,
                container: '.js-container-scroll',
                ...options
            };

            const container = document.querySelector(scrollOptions.container);
            if (!container) {
                console.warn(`Container ${scrollOptions.container} not found`);
                return;
            }

            const feedbackRect = feedbackElement.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            
            const scrollPosition = feedbackRect.top - containerRect.top + container.scrollTop - scrollOptions.offset;

            gsap.to(container, {
                duration: scrollOptions.duration,
                scrollTop: scrollPosition,
                ease: 'power2.out'
            });
        },

        checkAnswer() {
            this.showFeedback = true;
            
            // Проверяем, что выбраны все правильные ответы и нет неправильных
            const allCorrectSelected = this.options.every((option, index) => {
                if (option.correct) {
                    return this.selectedIndices.includes(index);
                }
                return true;
            });
            
            const noIncorrectSelected = this.selectedIndices.every(index => {
                return this.options[index].correct;
            });
            
            this.isCorrect = allCorrectSelected && noIncorrectSelected;

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
            this.selectedIndices = [];
            this.showFeedback = false;
        },
        nextSlide() {
            nextSlide();
        }
    }
});
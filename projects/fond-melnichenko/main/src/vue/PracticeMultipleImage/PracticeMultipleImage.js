Vue.component('v-multiple-image', {
    template: '#v-multiple-image-template',
    
    props: {
        imageArray: Array,
        feedback: Object,
        maxAttempts: {
            type: Number,
            default: 1
        },
        endPractice: Function,
        correctPractice: Function,
        gridStyle: Object,
        typeRadio: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            selectedImages: [],
            showFeedback: false,
            isCorrect: false,
            attemptsLeft: this.maxAttempts,
            hoverIndex: null
        }
    },
    computed: {
        showSubmitButton() {
            return !this.showFeedback && this.attemptsLeft > 0 && this.selectedImages.length > 0
        },
        multipleImageGridStyle() {
            if(window.screen.width >= 719) {
                return `grid-template-columns: repeat(${this.gridStyle.countRow}, 1fr)`
            } else {
                return `grid-template-columns: repeat(${this.gridStyle.countRowXs}, 1fr)`
            }
        },
        isDescScreen: function() {
            this.imageArray.forEach(item => {
                console.log(item.srcXs);
            });
            return window.screen.width >= 719;
        }
    },
    methods: {
        scrollToFeedback(options = {}) {
            const feedbackElement = this.$el.querySelector('.js-scroll-feedback');
            if (!feedbackElement) return;

            const container = document.querySelector('.js-container-scroll');
            if (!container) return;

            const feedbackRect = feedbackElement.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const scrollPosition = feedbackRect.top - containerRect.top + container.scrollTop - 300;

            gsap.to(container, {
                duration: 1,
                scrollTop: scrollPosition,
                ease: 'power2.out'
            });
        },

        toggleImage(index) {
            if (this.showFeedback) return;
            
            if (this.typeRadio) {
                // Режим радио-кнопки - выбираем только один элемент
                if (this.selectedImages[0] === index) {
                    // Если кликаем на уже выбранный элемент - снимаем выбор
                    this.selectedImages = [];
                } else {
                    // Выбираем новый элемент (предыдущий автоматически снимается)
                    this.selectedImages = [index];
                }
            } else {
                // Стандартный режим множественного выбора
                const idx = this.selectedImages.indexOf(index);
                if (idx === -1) {
                    this.selectedImages.push(index);
                } else {
                    this.selectedImages.splice(idx, 1);
                }
            }
        },

        checkAnswer() {
            this.showFeedback = true;
            this.hoverIndex = null; // Сбрасываем ховер
            
            const allSelectedCorrect = this.selectedImages.every(idx => this.imageArray[idx].correct);
            const allCorrectSelected = this.imageArray.every((img, idx) => 
                !img.correct || this.selectedImages.includes(idx)
            );
            
            this.isCorrect = allSelectedCorrect && allCorrectSelected;

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
            this.selectedImages = [];
            this.showFeedback = false;
        },
        
        getImageClasses(index) {
            return {
                'selected': this.selectedImages.includes(index),
                'correct-feedback': this.showFeedback && this.imageArray[index].correct && this.selectedImages.includes(index),
                'incorrect-feedback': this.showFeedback && !this.imageArray[index].correct && this.selectedImages.includes(index)
            };
        }
    }
});
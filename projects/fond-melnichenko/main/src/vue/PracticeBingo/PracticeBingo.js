Vue.component('v-bingo', {
    template: '#v-bingo-template',
    
    props: {
        bingoArray: Array,
        feedback: Object,
        maxAttempts: {
            type: Number,
            default: 1
        },
        endPractice: Function,
        correctPractice: Function,
        gridStyle: Object,
        countActiveItems: Number,
    },
    data() {
        return {
            selectedItems: [],
            showFeedback: false,
            isCorrect: false,
            attemptsLeft: this.maxAttempts,
            hoverIndex: null
        }
    },
    computed: {
        showSubmitButton() {
            return !this.showFeedback && this.attemptsLeft > 0 && this.selectedItems.length >= this.countActiveItems
        },
        bingoGridStyle() {
            if(window.screen.width >= 719) {
                return `grid-template-columns: repeat(${this.gridStyle.countRow}, 1fr)`
            } else {
                return `grid-template-columns: repeat(${this.gridStyle.countRowXs}, 1fr)`
            }
        },
        isDescScreen: function() {
            
            this.bingoArray.forEach(item => {
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
            
            const idx = this.selectedItems.indexOf(index);
            if (idx === -1) {
                this.selectedItems.push(index);
            } else {
                this.selectedItems.splice(idx, 1);
            }
        },

        checkAnswer() {
            this.showFeedback = true;
            
            const allSelectedCorrect = this.selectedItems.every(idx => this.bingoArray[idx].correct);
            const allCorrectSelected = this.bingoArray.every((img, idx) => 
                !img.correct || this.selectedItems.includes(idx)
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
            this.selectedItems = [];
            this.showFeedback = false;
        },
        
        // Упрощенный метод для классов изображений
        getImageClasses(index) {
            return {
                'selected': this.selectedItems.includes(index),
                'correct-feedback': this.showFeedback && this.bingoArray[index].correct && this.selectedItems.includes(index),
                'incorrect-feedback': this.showFeedback && !this.bingoArray[index].correct && this.selectedItems.includes(index)
            };
        }
    }
});
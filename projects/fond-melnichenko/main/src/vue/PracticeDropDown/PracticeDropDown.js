// Регистрируем компонент кастомного select
Vue.component('custom-select', {
  template: '#custom-select-template',
  props: {
    value: [String, Number],
    options: Array,
    placeholder: String,
    disabled: Boolean,
    correct: Boolean,
    incorrect: Boolean,
    submitted: Boolean,
  },
  data() {
    return {
      isOpen: false,
      minWidth: '20px'
    }
  },
  computed: {
    selectedText() {
      return this.value || '';
    }
  },
  mounted() {
    this.calculateMinWidth();
  },
  watch: {
    options: {
      immediate: true,
      handler() {
        this.$nextTick(this.calculateMinWidth);
      }
    },
    submitted(newVal) {
        newVal = !newVal;
    }
  },
  methods: {
    calculateMinWidth() {
      // Если нет опций
        if (!this.options?.length) {
            this.minWidth = '20px';
            return;
        }
        
        // Измеряем ширину текста
        const textWidth = this.measureTextWidth(
            this.options.reduce(function (a, b) {
                if (a.length > b.length) {
                    return a;
                } else if (a.length == b.length) {
                    const numberOfSpacesA = (a.match(/\s/g) || []).length;
                    const numberOfSpacesB = (b.match(/\s/g) || []).length;
                    if (numberOfSpacesA > numberOfSpacesB) {
                        return b;
                    } else {
                        return a;
                    }
                } else {
                    return b;
                }
            })
        );
        
        // Рассчитываем итоговую ширину с ограничениями
        const calculatedWidth = textWidth + 60;
        const maxAllowedWidth = window.innerWidth * 0.8; // 90% от ширины вьюпорта
        
        this.minWidth = `${Math.min(
            Math.min(500, Math.max(20, calculatedWidth)), // Не меньше 20px
            maxAllowedWidth // Не больше 90% ширины экрана
        )}px`;
    },

    measureTextWidth(text) {
        const span = document.createElement('span');
        span.style.visibility = 'hidden';
        span.style.position = 'absolute';
        span.style.whiteSpace = 'nowrap';
        span.style.font = window.getComputedStyle(this.$el).font;
        span.textContent = text;
        
        document.body.appendChild(span);
        const width = span.offsetWidth;
        document.body.removeChild(span);
        
        return width;
    },

    toggleDropdown() {
      if (!this.disabled) {
        this.isOpen = !this.isOpen;
      }
    },

    selectOption(option) {
      this.$emit('input', option);
      this.$emit('change', option);
      this.isOpen = false;
    },

    isSelected(option) {
      return this.value === option;
    },

    handleClickOutside(e) {
      if (!this.$el.contains(e.target)) {
        this.isOpen = false;
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside);
  }
});

// Регистрация компонента Vue под именем 'vPracticeDropDown'
Vue.component('vPracticeDropDown', {
    template: '#v-practice-drop-down-template',
    
    props: {
        originalText: String,
        gaps: Array,
        totalExercises: Number,
        feedbackMessages: Object,
        persImage: String,
        endPractice: Function,
        explanation: String,
        correctPractice: Function,
        list: { type: Boolean, default: false },
        nextSlideBtn: { type: Boolean, default: true },
        textCenterLg: { type: Boolean, default: false},
    },
    
    data: function() {
        return {
            submitted: false,
            hasBackground: true,
            currentFeedback: '',
            showExplanation: false,
            currentExercise: 1,
        }
    },
    
    computed: {
        splitText() {
            let parts = [];
            let text = this.originalText;
            let gapIndex = 0;
            let lastIndex = 0;
            
            const regex = /\[(.*?)\]/g;
            let match;
            
            while ((match = regex.exec(text)) !== null) {
                if (match.index > lastIndex) {
                    parts.push({
                        isGap: false,
                        text: text.substring(lastIndex, match.index)
                    });
                }
                
                parts.push({
                    isGap: true,
                    gapIndex: gapIndex++
                });
                
                lastIndex = regex.lastIndex;
            }
            
            if (lastIndex < text.length) {
                parts.push({
                    isGap: false,
                    text: text.substring(lastIndex)
                });
            }
            
            return parts;
        },

        processedTextList() {
            return (idx) => {
                let parts = [];
                let text = this.originalText;
                let lastIndex = 0;
                
                const regex = /\[(.*?)\]/g;
                let match;
                let found = false;
                
                while ((match = regex.exec(text)) !== null) {
                    if (match.index > lastIndex) {
                        parts.push({
                            isGap: false,
                            text: text.substring(lastIndex, match.index)
                        });
                    }
                    
                    if (!found) {
                        parts.push({
                            isGap: true,
                            gapIndex: idx
                        });
                        found = true;
                    }
                    
                    lastIndex = regex.lastIndex;
                }
                
                if (lastIndex < text.length) {
                    parts.push({
                        isGap: false,
                        text: text.substring(lastIndex)
                    });
                }
                
                return parts.map((part, i) => {
                    if (part.isGap) {
                        const gap = this.gaps[part.gapIndex];
                        const isSubmitted = this.submitted;
                        const isCorrect = gap.selected === gap.correct;
                        
                        return `
                            <select class="gap-select ${isSubmitted ? (isCorrect ? 'correct' : 'incorrect') : ''}" 
                                    data-id="${gap.id}" 
                                    ${isSubmitted ? 'disabled' : ''}
                                    required>
                                ${!gap.selected ? '<option value="" selected disabled hidden></option>' : ''}
                                ${gap.options.map(opt => 
                                    `<option value="${opt}" ${gap.selected === opt ? 'selected' : ''}>${opt}</option>`
                                ).join('')}
                            </select>
                        `;
                    } else {
                        return part.text;
                    }
                }).join('');
            };
        },

        allAnswersSelected() {
            return this.gaps.every(gap => gap.selected !== null);
        },

        allCorrect() {
            return this.gaps.every(gap => gap.selected === gap.correct);
        },

        feedbackClass() {
            if (!this.submitted) return '';
            return this.allCorrect ? 'correct' : 'incorrect';
        }
    },
    
    methods: {
        getGapOptions(gapIndex) {
            return this.gaps[gapIndex]?.options || [];
        },

        handleSelectChange(value, gapId) {
            const gap = this.gaps.find(g => g.id === gapId);
            if (gap) {
                gap.selected = value;
            }
        },

        checkAnswers() {
            this.submitted = true;
            this.hasBackground = false;
            this.currentFeedback = this.allCorrect 
                ? this.feedbackMessages.correct.text
                : this.feedbackMessages.incorrect.text;

            if(this.allCorrect) {
                this.endPractice();
                this.showExplanation = true;
                this.correctPractice();
            }
            setTimeout(() => {
                this.scrollToFeedback();
            }, 300);
        },
        
        resetAnswers() {
            this.gaps.forEach(gap => {
                gap.selected = null;
            });
            this.submitted = false;
            this.hasBackground = true;
            this.currentFeedback = '';
            this.currentExercise++;
        },

        showAnswers() {
            this.gaps.forEach(gap => {
                gap.selected = gap.correct;
            });
            this.endPractice();
            this.showExplanation = true;
            // scrollToContent('js-drop-down-scroll' + this._uid);
        },

        nextSlide() {
            nextSlide();
        },

        scrollToFeedback(options = {}) {
            const feedbackElement = this.$el.querySelector('.js-scroll-feedback');
            
            if (!feedbackElement) {
                console.warn('Element with class .js-scroll-feedback not found');
                return;
            }

            const scrollOptions = {
                offset: 100,
                duration: 3,
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
    },
    
    mounted() {
        this.$el.addEventListener('change', (e) => {
            if (e.target.classList.contains('gap-select')) {
                const select = e.target;
                const gapId = parseInt(select.dataset.id);
                const selectedValue = select.value;
                
                const gap = this.gaps.find(g => g.id === gapId);
                if (gap) {
                    gap.selected = selectedValue === "" ? null : selectedValue;
                }
            }
        });
    }
});
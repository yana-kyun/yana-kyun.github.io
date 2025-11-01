// Создаем Vue компонент для диалоговой системы
Vue.component("vDialog", {
  // Указываем шаблон компонента (должен быть определен в HTML)
  template: "#v-dialog-template",
  
  // Пропсы - входные параметры компонента
  props: {
    feedBack: String, // Текст обратной связи
    questionStorage: Array, // Массив вопросов диалога
    endDialog: Function, // Функция завершения диалога
    persName: String, // Имя персонажа
    bubbleDelay: Number, // Задержка между сообщениями (в секундах)
    nextBtnOff: Boolean, // Флаг отключения кнопки "Далее"
    skills: Array, // Массив навыков
    nextBtnText: String, // Текст кнопки "Далее"
  },

  // Локальное состояние компонента
  data: function () {
    return {
        testArray: [], // Копия questionStorage для работы
        currentQuestionIndex: 0, // Индекс текущего вопроса
        isVisible: true, // Видимость компонента
        feedbackAnswerShow: false, // Показывать ли feedback
        showFinalButton: false, // Показывать ли финальную кнопку
        showFirstText: false, // Показывать ли первый текст
        showSecondText: false, // Показывать ли второй текст
        currentFirstTextIndex: -1, // Текущий индекс в firstText
        currentSecondTextIndex: -1, // Текущий индекс в secondText
        firstTextBubbles: [], // Массив баблов первого текста
        shownFirstTextBubbles: [], // Массив для хранения показанных баблов
        secondTextBubbles: [], // Массив баблов второго текста
        animationTimeout: null, // Таймер анимации
        completedQuestions: [], // Завершенные вопросы (по индексам)
        selectedAnswers: {}, // Выбранные ответы (теперь по id вопросов)
        resultsListArray: [], // Результаты теста
        btnIndex: undefined,
        addMargin: false,
        removeMargin: false,
    };
  },

  // Вычисляемые свойства
  computed: {
    
  },

  // Наблюдатели за изменениями данных
  watch: {
    // При появлении feedback прокручиваем к нему
    feedbackAnswerShow(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.scrollToLastAutoScrollElement();
          }, 100);
        });
      }
    }
  },

  // Методы компонента
  methods: {
    // Показать финальную кнопку с задержкой
    showFinalButtonAfterDelay() {
        return new Promise(resolve => {
            setTimeout(() => {
                this.showFinalButton = true;
                this.scrollToLastAutoScrollElement();
                this.endDialog();
                this.addMargin = true;
                this.removeMargin = true,
                resolve();
            }, 1000);
        });
    },

    // Получить firstText для показа в зависимости от предыдущего ответа
    getFirstTextToShow(questionIndex, question) {
      // Для первого вопроса берем весь firstText
      if (questionIndex === 0) return question.firstText || [];
      
      // Находим id предыдущего вопроса
      const prevQuestionId = this.findPreviousQuestionId(question.id);
      
      if (!prevQuestionId) return question.firstText || [];
      
      // Получаем индекс выбранного ответа в предыдущем вопросе
      const prevAnswerIndex = this.selectedAnswers[prevQuestionId];
      
      
      if (prevAnswerIndex === undefined) return question.firstText || [];
      
      // Проверяем существование соответствующей ветки firstText
      if (question.firstText && question.firstText.length > prevAnswerIndex) {
        return [question.firstText[prevAnswerIndex]];
      }
      
      // Fallback: если ветки нет, возвращаем первую или пустой массив
      // console.warn(`No firstText branch for answer index ${prevAnswerIndex} in question ${question.id}`);
      
      return question.firstText?.length ? [question.firstText[0]] : [];
    },

    // Найти id предыдущего вопроса по id текущего
    findPreviousQuestionId(currentQuestionId) {
      for (const question of this.testArray) {
        const answers = question.answers || [];
        for (const answer of answers) {
          if (answer.roadNextQuestion === currentQuestionId) {
            return question.id;
          }
        }
      }
      return null;
    },

    // Найти индекс предыдущего вопроса (для обратной совместимости)
    findPreviousQuestionIndex(currentIndex) {
      const currentId = this.testArray[currentIndex].id;
      const prevQuestionId = this.findPreviousQuestionId(currentId);
      if (!prevQuestionId) return -1;
      
      return this.testArray.findIndex(q => q.id === prevQuestionId);
    },

    getBubbleGlobalIndex(itemIndex, bubbleIndex) {
        let globalIndex = 0;
        const firstText = this.getFirstTextToShow(this.currentQuestionIndex, this.testArray[this.currentQuestionIndex]);
        
        for (let i = 0; i < itemIndex; i++) {
            globalIndex += firstText[i]?.text?.length || 0;
        }
        
        return globalIndex + bubbleIndex;
    },

    // Инициализация вопросов
    initQuestions() {
      // Сбрасываем все показанные баблы при начале нового диалога
      this.shownFirstTextBubbles = [];
      // Создаем копию массива вопросов
      this.testArray = JSON.parse(JSON.stringify(this.questionStorage));
      // Устанавливаем начальные состояния для каждого вопроса
      this.testArray.forEach((q, i) => {
        q.answersVisible = false; // Ответы не видны
        q.disabled = false; // Ответы не заблокированы
        q.completed = false; // Вопрос не завершен
        Vue.set(this.testArray, i, q); // Реактивное обновление
      });
      // Начинаем с первого вопроса
      this.startQuestion(0);
    },
    
    // Начать вопрос по индексу
    async startQuestion(index) {
        if (index >= this.testArray.length) {
            await this.showFinalButtonAfterDelay();
            this.addMargin = true;
            this.removeMargin = true;
            return;
        }

        this.resetQuestionState();
        this.currentQuestionIndex = index;
        const question = this.testArray[index];
        const firstTextToShow = this.getFirstTextToShow(index, question);
        
        this.prepareBubblesData(question, firstTextToShow);

        // Обработка firstText (если есть)
        if (firstTextToShow.length > 0) {
            this.showFirstText = true;
            await this.processBubblesWithDelay(
                () => this.currentFirstTextIndex < this.firstTextBubbles.length - 1,
                () => this.currentFirstTextIndex++,
                true
            );
        }
        
        
        // Добавляем небольшую задержку перед secondText для плавного перехода
        if (firstTextToShow.length > 0 && question.secondText?.length) {
            await this.delay(this.bubbleDelay * 100);
        }

        // Обработка secondText (если есть)
        if (question.secondText?.length) {
            this.showFirstText = false;
            this.showSecondText = true;
            
            await this.processBubblesWithDelay(
                () => this.currentSecondTextIndex < this.secondTextBubbles.length - 1,
                () => this.currentSecondTextIndex++
            );
        }

        // Для финального вопроса - показываем кнопку
        if (this.isFinalQuestion(question, index)) {
            await this.showFinalButtonAfterDelay();
            return;
        }

        // Для обычных вопросов - показываем ответы
        this.showAnswers();
    },

    // Общий метод для обработки баблов с задержкой
    async processBubblesWithDelay(conditionFn, incrementFn, isFirstText = false) {
        // Добавляем проверку на активность вопроса
        if (!this.isQuestionActive(this.currentQuestionIndex)) {
            return;
        }

        while (conditionFn()) {
            incrementFn();
            
            if (isFirstText) {
                const currentBubble = this.firstTextBubbles[this.currentFirstTextIndex];
                const bubbleKey = `${this.currentQuestionIndex}-${currentBubble.itemIndex}-${currentBubble.bubbleIndex}`;
                
                if (!this.shownFirstTextBubbles.includes(bubbleKey)) {
                    this.shownFirstTextBubbles = [...this.shownFirstTextBubbles, bubbleKey];
                }
            }
            
            // Добавляем принудительное обновление интерфейса
            await this.$nextTick();
            this.scrollToLastAutoScrollElement();
            
            // Задержка с возможностью прерывания
            try {
                await this.delay(this.bubbleDelay * 1000);
            } catch (e) {
                if (e instanceof Error && e.message === 'Delay cancelled') {
                    return;
                }
            }
        }
        
        // Уменьшаем финальную задержку для более быстрого перехода
        await this.delay(50);
    },

    shouldShowTypingIndicator(keyQuestion) {
        if (keyQuestion !== this.currentQuestionIndex || 
            this.showFinalButton || 
            this.feedbackAnswerShow) {
            return false;
        }

        const question = this.testArray[this.currentQuestionIndex];
        
        // Для firstText
        if (this.showFirstText && this.firstTextBubbles.length > 0) {
            const hasMoreFirstBubbles = this.currentFirstTextIndex < this.firstTextBubbles.length - 1;
            const isLastFirstBubble = this.currentFirstTextIndex === this.firstTextBubbles.length - 1;
            const hasSecondText = question.secondText?.length > 0;
            
            return hasMoreFirstBubbles || (isLastFirstBubble && hasSecondText && !this.showSecondText);
        }
        
        // Для secondText
        if (this.showSecondText && this.secondTextBubbles.length > 0) {
            const hasMoreSecondBubbles = this.currentSecondTextIndex < this.secondTextBubbles.length - 1;
            const firstTextCompleted = !this.showFirstText || 
                                    (this.firstTextBubbles.length > 0 && 
                                    this.currentFirstTextIndex >= this.firstTextBubbles.length - 1);
            
            return hasMoreSecondBubbles && firstTextCompleted;
        }
        
        return false;
    },

    // логика отступов в конце диалога
    shouldRemoveMargin(index, question) {
        const isLastOrFinal = index === this.testArray.length - 1 || question.thisFinalQuestion;
        const hasNoAnswers = !question.answers || question.answers.length === 0;
        return isLastOrFinal && hasNoAnswers;
    },
    
    // Подготовка данных баблов для отображения
    prepareBubblesData(question, firstTextToShow) {
        // Формируем массив баблов firstText
        this.firstTextBubbles = [];
        firstTextToShow?.forEach((item, itemIndex) => {
            item.text?.forEach((bubble, bubbleIndex) => {
                this.firstTextBubbles.push({
                    itemIndex,
                    bubbleIndex,
                    bubbleText: bubble.bubbleText
                });
            });
        });
        
        // Формируем массив баблов secondText
        this.secondTextBubbles = question.secondText?.map((text, idx) => ({
            index: idx,
            text: text.text,
            results: text.results || false
        })) || [];
    },
    
    // Проверка, является ли вопрос финальным
    isFinalQuestion(question, index) {
        return (question.thisFinalQuestion || index === this.testArray.length - 1) && 
            (!question.answers || question.answers.length === 0);
    },
    
    // Вспомогательный метод для задержки
    delay(ms) {
      return new Promise(resolve => {
        if (this.animationTimeout) clearTimeout(this.animationTimeout);
        this.animationTimeout = setTimeout(resolve, ms);
      });
    },

    // Прокрутка к последнему элементу с автоскроллом
    scrollToLastAutoScrollElement() {
      this.$nextTick(() => {
        setTimeout(() => {
          const autoScrollElements = document.querySelectorAll('.js-auto-scroll');
          
          if (autoScrollElements.length > 0) {
            const lastElement = autoScrollElements[autoScrollElements.length - 1];
            if (lastElement.offsetParent !== null) {
              this.scrollToElement(lastElement, 1.5, 0.2);
            }
          }
        }, 200);
      });
    },

    // Прокрутка к конкретному элементу
    scrollToElement(elem, duration, delay) {
      startPreloadImages(() => {
        let offsetTop = elem.offsetTop;
        while (!elem.classList.contains('js-container-scroll')) {
          elem = elem.offsetParent;
          offsetTop += elem.offsetTop;
        }
        gsap.to('.js-container-scroll', {
          duration: duration,
          scrollTop: offsetTop - 300,
          delay: delay,
          ease: "power1.inOut"
        });
      });
    },
    
    // Показать варианты ответов
    showAnswers() {
        this.currentFirstTextIndex = this.firstTextBubbles.length;
        this.currentSecondTextIndex = this.secondTextBubbles.length;

        const question = this.testArray[this.currentQuestionIndex];
        question.answersVisible = true;
        Vue.set(this.testArray, this.currentQuestionIndex, question);
        this.scrollToLastAutoScrollElement();
    },
    
    // Обработка выбора ответа
    async isTarget(event, keyAnswer, type, answerText) {
      const question = this.testArray[this.currentQuestionIndex];
      const selectedAnswer = question.answers[keyAnswer];
      // Устанавливаем feedback и скрываем ответы
      question.feedback = answerText;
      question.answersVisible = false;
      question.completed = true;
      Vue.set(this.testArray, this.currentQuestionIndex, question);
      
      this.btnIndex = keyAnswer;

      // Сохраняем выбранный ответ по id вопроса
      this.selectedAnswers[question.id] = keyAnswer;
      
      this.completedQuestions.push(this.currentQuestionIndex);
      
      // Показываем feedback
      this.feedbackAnswerShow = true;
      
      // Ждем перед переходом к следующему вопросу
      await this.delay(this.bubbleDelay * 1000 * 0.75);
      this.feedbackAnswerShow = false;
      
      // Определяем следующий вопрос
      const nextQuestionId = selectedAnswer.roadNextQuestion;
      if (nextQuestionId) {
        const nextQuestionIndex = this.testArray.findIndex(q => q.id === nextQuestionId);
        if (nextQuestionIndex !== -1) {
          this.startQuestion(nextQuestionIndex);
          return;
        }
      }
      
      // Если следующего вопроса нет - завершаем
      await this.showFinalButtonAfterDelay();
      this.addMargin = true;
      this.removeMargin = true;
      this.endDialog();
    },

    // Найти индекс вопроса по id
    findQuestionIndexById(id) {
      return this.testArray.findIndex(q => q.id === id);
    },
    
    // Сброс состояния вопроса
    resetQuestionState() {
      this.showFirstText = false;
      this.showSecondText = false;
      this.currentFirstTextIndex = -1;
      this.currentSecondTextIndex = -1;
      this.firstTextBubbles = [];
      this.secondTextBubbles = [];
      this.feedbackAnswerShow = false;
      
      if (this.animationTimeout) {
        clearTimeout(this.animationTimeout);
        this.animationTimeout = null;
      }
    },
    
    // Переход к следующему слайду
    nextSlide() {
      nextSlide();
    },
    
    // Проверка, нужно ли показывать бабл firstText
    shouldShowFirstBubble(itemIndex, bubbleIndex) {
        if (this.isQuestionCompleted(this.currentQuestionIndex)) {
            return true;
        }
        
        const bubbleKey = `${this.currentQuestionIndex}-${itemIndex}-${bubbleIndex}`;
        
        if (this.shownFirstTextBubbles.includes(bubbleKey)) {
            return true;
        }
        
        return this.showFirstText && 
                this.currentFirstTextIndex >= this.getBubbleGlobalIndex(itemIndex, bubbleIndex);
    },
    
    // Получить задержку для бабла firstText
    getFirstBubbleDelay(itemIndex, bubbleIndex) {
      const bubble = this.firstTextBubbles.find(b => 
        b.itemIndex === itemIndex && b.bubbleIndex === bubbleIndex
      );
      const index = this.firstTextBubbles.indexOf(bubble);
      return index <= this.currentFirstTextIndex ? '0s' : `${this.bubbleDelay}s`;
    },
    
    // Получить задержку для бабла secondText
    getSecondBubbleDelay(index) {
      return index <= this.currentSecondTextIndex ? '0s' : `${this.bubbleDelay}s`;
    },
    
    // Проверка, активен ли вопрос
    isQuestionActive(keyQuestion) {
      return this.completedQuestions.includes(keyQuestion) || keyQuestion === this.currentQuestionIndex;
    },
    
    // Проверка, завершен ли вопрос
    isQuestionCompleted(keyQuestion) {
      return this.completedQuestions.includes(keyQuestion);
    },

    // Получить текущие результаты
    currentResults() {
      if (!window.CLV?.oGlobal?.practice) return [];
      
      const resultsNameArray = Object.entries(CLV.oGlobal.practice)
        .filter(([_, value]) => value === true)
        .map(([key]) => key);

      this.resultsListArray = this.skills
        .filter(obj => resultsNameArray.includes(obj.name) && obj.text)
        .map(obj => obj.text);
      
      return this.resultsListArray;
    },
  },

  // Хук монтирования компонента
  mounted() {
    this.initQuestions();
    this.currentResults();

    // Проверка на пустой диалог
    if (this.testArray.length === 0) {
        this.addMargin = true;
        this.removeMargin - true;
    }
  },

  // Хук перед уничтожением компонента
  beforeDestroy() {
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }
  }
});
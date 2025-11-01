Vue.component('vTestPreliminary', {
  template: '#v-test-preliminary-template',
  props: {
    /*Хранилище вопросов*/
    questionStorage: Array,
    /*Проверять ли выбранный ответ*/
    checkAnswer: Boolean,
    /*Перемешивать ли массив*/
    random: Boolean,
    /*Включает банер предыстории*/
    storyMod: Boolean,
    /*Тип окна обратной связи*/
    feedbackType: String,
    /*Продолжать ли показ слайда после конца теста*/
    continueSlide: Boolean,
    /*Количество вопросов*/
    questionThreshold: Number,
    passingScore: Number,
    testCallback: {
      type: Function
    },
    // prelimTest: Boolean,
  },
  data: function () {
    return {
      currentOS: '',
      /*Текущий вопрос*/
      counterQuestion: 0,
      /*Щетчик правельных ответов*/
      counterCorrect: 0,
      /*Временное хранилище вопросов*/
      tempStorage: {
        type: '',
        items: []
      },
      btnReset: false,
      btnNextText: '',
      btnShowCorrect: false,
      /*Принять ответ*/
      btnAccept: false,
      /*Следующий вопрос*/
      btnNext: false,
      isAnswered: false,
      showCorrectAnswer: false,
      btnNextText: '',
      /*Обратная связь*/
      feedbackShow: false,
      /*Блокировка ответов*/
      disableInput: false,
      isCorrect: false
    }
  },
  computed: {
    /*Перемешиваем массив*/
    testArray: function () {
      // this.testCallback();
      return this.shuffling(this.questionStorage);
    },
    isLastQuestion: function () {
      return this.testArray.length === this.counterQuestion + 1;
    },
  },
  methods: {
    /*Метод перемешиваем массив*/
    shuffling: function (data) {
      if (this.random) {
        /*перемешиваем вопросы*/
        // data.sort(function () {
        //     return Math.random() - 0.5;
        // });

        /*Отсекаем часть вопросов*/
        data = data.slice(0, this.questionThreshold);

        /*перемешиваем ответы вопроса*/
        data.forEach(function (item, key) {
          /*добоваляем параметр выбора к ответам*/
          item.answers.forEach(function (answer, key) {
            answer.selected = false;
          });

          item.answers.sort(function () {
            return Math.random() - 0.5;
          })
        })
      }
      return data;
    },
    /*Событие выбора елемента*/
    isTarget: function ($event, key, type) {
      var currQuestion = this.testArray[this.counterQuestion];
      var currAnswer = currQuestion.answers[key];

      /*добавляем тип вопроса во временное хранилище*/
      this.tempStorage.type = type;
      /*проверяем тип выбранного обьекта*/
      if (type === 'radio') {
        /*добавдяем выбранный элемент во временное хранилище*/
        this.tempStorage.items = key;

        currQuestion.answers.forEach(function (answer, key) {
          answer.selected = false;
        });

        currAnswer.selected = true;

      } else if (type === 'checkbox') {
        if ($event.target.checked) {
          /*добавдяем выбранный элемент во временное хранилище*/
          this.tempStorage.items.push(key);
        } else {
          /*удаляем выбранный элемент из временного хранилища*/
          delete this.tempStorage.items.splice(this.tempStorage.items.indexOf(key), 1);
        }
      }

      /*Скрываем или показываем кнопку принять если ответ не выбран*/
      if (this.tempStorage.items.length !== 0) {
        this.btnAccept = true;
      } else {
        this.btnAccept = false;
      }
    },
    /*Принять ответ*/
    acceptAnswer: function () {
      /*Текущий вопрос*/
      var currentQuestion = this.testArray[this.counterQuestion];
      var currentAnswer = currentQuestion.answers;


      /*Проверяем тип принятого вопроса*/
      if (currentQuestion.type === 'radio') {
        var correctAnswer = false;
        var answerFeedback = '';

        /*Проверяем правильность ответа*/
        currentAnswer.forEach(function (answer, key) {

          if (answer.correct && answer.selected) {
            correctAnswer = true;
          }

          if (answer.selected) {
            answerFeedback = answer.feedback;
          }
        });

        if (correctAnswer) {

          this.counterCorrect++
          if (currentQuestion.correctOS !== '') {
            this.currentOS = currentQuestion.correctOS;
          } else {
            this.currentOS = answerFeedback;
          }

          // this.feedbackShow = true;
          this.btnAccept = false;
          this.disableInput = true;
          this.btnNext = true;
          this.isCorrect = true;
        } else {

          if (currentQuestion.incorrectOS !== '') {
            this.currentOS = currentQuestion.incorrectOS;
          } else {
            this.currentOS = answerFeedback;
          }

          // this.feedbackShow = true;
          this.btnAccept = false;
          this.disableInput = true;
          this.btnReset = true;
          this.btnShowCorrect = true;
          this.isCorrect = false;
        }

      } else if (currentQuestion.type === 'checkbox') {
        var correctAnswer = 0;
        var selectAnswer = 0;
        var selectCorrectAnswer = 0;

        /*Проверяем количество верных ответов*/
        currentAnswer.forEach(function (answer, key) {
          if (answer.correct) {
            correctAnswer++;
          }
          if (answer.selected) {
            selectAnswer++

            if (answer.correct) {
              selectCorrectAnswer++;
            }
          }
        });

        /*если все ответы верные присваиваем балл*/
        if (correctAnswer === selectCorrectAnswer && correctAnswer === selectAnswer) {
          this.counterCorrect++

          this.currentOS = currentQuestion.correctOS;

          // this.feedbackShow = true;
          this.btnAccept = false;
          this.disableInput = true;
          this.btnNext = true;
          this.isCorrect = true;

        } else if (selectCorrectAnswer > 0) {
          //this.currentOS = currentQuestion.mainesOS;
          this.currentOS = currentQuestion.incorrectOS;

          // this.feedbackShow = true;
          this.btnAccept = false;
          this.disableInput = true;
          this.btnReset = true;
          this.btnShowCorrect = true;
          this.isCorrect = false;
        } else {
          this.currentOS = currentQuestion.incorrectOS;

          // this.feedbackShow = true;
          this.btnAccept = false;
          this.disableInput = true;
          this.btnReset = true;
          this.btnShowCorrect = true;
          this.isCorrect = false;
        }
      }

      if (this.feedbackType === 'dontCorrect' || this.feedbackType === 'contextBlock' || this.feedbackType ==='highlight') {
        this.isAnswered = true;
      }

      /*Смотрим нужно ли выводить фидбек после принятия ответа*/
      if (this.checkAnswer) {
        // if (this.feedbackType === 'contextBlock') {

        // } else {
          /*Скрываем кнопку принять ответ*/
        this.btnAccept = false;
          /*Блокируем ответы*/
        this.disableInput = true;
        
        
        /*Показываем кнопку продолжить*/
        this.btnNext = true;

      } else {
        /*Переходим к следующему вопросу*/
        if (!this.isLastQuestion) {
          this.btnNext = true;
          this.nextQuestion();
        } else {
          this.btnAccept = false;
          // this.feedbackShow = true;
          if (this.feedbackType === 'highlight') {
              this.testCallback(this.counterCorrect);
          }
        }
      }

      if (this.testArray.length !== this.counterQuestion + 1) {
        this.btnNextText = 'Следующий вопрос';
      } else {
        this.btnNextText = 'К результату';
      }
      
      if (this.isLastQuestion && this.feedbackType !== 'dontCorrect') {
        this.testCallback(this.counterCorrect);
      }
      return this.counterCorrect
    },
    /*Следующий вопрос*/
    nextQuestion: function () {

      if (this.testArray.length - 1 === this.counterQuestion) {

        if (!this.continueSlide) {
          // nextSlide();
          this.feedbackShow = true;
          this.btnNext = false;
        } else {

          this.btnNext = false;
          this.btnReset = false;
          this.btnShowCorrect = false;
          
          $('.js-hide-content-test').show();

          if (this.feedbackType === 'highlight') {
            this.counterQuestion++;
            // this.isAnswered = false;
          }
        }
      } else {
        this.counterQuestion++;

        /*Очищаем временное хранилище*/
        this.tempStorage.type = '';
        this.tempStorage.items = [];
        this.disableInput = false;
        this.btnNext = false;
        // this.feedbackShow = false;
        this.isAnswered = false;
        this.showCorrectAnswer = false;
      }
    },
    showCorrectQuestion: function () {
      let th = this;

      this.testArray.forEach(function (items, key) {
        if (key === th.counterQuestion) {
          items.answers.forEach(function (answer, key) {
            if (answer.correct) {
              answer.selected = true;
            } else {
              answer.selected = false;
            }
          })
        }
      });

      this.currentOS = this.testArray[this.counterQuestion].postmetoOS;

      this.btnNext = true;
      this.isCorrect = true;
      this.showCorrectAnswer = true;
    },
    /*Перезаписать тестирование*/
    resetQuestion: function () {
      // this.feedbackShow = false;
      this.disableInput = false;
      this.btnNext = false;
      this.isAnswered = false;

      /*Убираем состояние селект*/
      this.testArray.forEach(function (items, key) {
        items.answers.forEach(function (answer, key) {
          answer.selected = false;
        })
      });
    },
    /*Перезаписать тестирование*/
    resetTest: function () {
      this.feedbackShow = false;
      this.counterQuestion = 0;
      this.counterCorrect = 0;
      this.disableInput = false;
      this.isAnswered = false;

      /*Убираем состояние селект*/
      this.testArray.forEach(function (items, key) {
        items.answers.forEach(function (answer, key) {
          answer.selected = false;
        })
      });
    },
    nextSlide: function () {

      if (!this.continueSlide) {
        nextSlide();
      } else {
        this.btnNext = false;
        $('.js-hide-content-test').show();
      }
    },
  },
});
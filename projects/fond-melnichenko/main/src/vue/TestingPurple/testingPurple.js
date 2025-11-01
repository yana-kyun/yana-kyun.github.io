Vue.component('vTestPurple', {
  template: '#v-test-purple-template',
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
    /* Показывать кнопку Узнать ответ */
    showCorrect: Boolean,
    /*Продолжать ли показ слайда после конца теста*/
    continueSlide: Boolean,
    allCorrect: Boolean,
    /* Ticks and checkboxes */
    tick: Boolean,
    /* Text input value */
    testCallback: {
      type: Function
    },
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
      btnShowCorrect: false,
      /*Принять ответ*/
      btnAccept: false,
      /*Следующий вопрос*/
      btnNext: false,
      /*Обратная связь*/
      feedbackShow: false,
      /*Блокировка ответов*/
      disableInput: false,
      answerInput: '',
      isCorrect: false,
      isTicked: false,
    }
  },
  computed: {
    /*Перемешиваем массив*/
    testArray: function () {
      return this.shuffling(this.questionStorage);
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
    handleInput: function (event) {
      let answerValue = event.target.value;
      // console.log(answerValue.length);
      answerValue.length !== 0 ? this.btnAccept = true : this.btnAccept = false;
    },
    /*Принять ответ*/
    acceptAnswer: function () {

      this.isTicked = true;
      
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

          this.feedbackShow = true;
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

          this.feedbackShow = true;
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

          this.feedbackShow = true;
          this.btnAccept = false;
          this.disableInput = true;
          this.btnNext = true;
          this.isCorrect = true;

        } else if (selectCorrectAnswer > 0) {
          //this.currentOS = currentQuestion.mainesOS;
          this.currentOS = currentQuestion.incorrectOS;

          this.feedbackShow = true;
          this.btnAccept = false;
          this.disableInput = true;
          this.btnReset = true;
          this.btnShowCorrect = true;
          this.isCorrect = false;

        } else {
          this.currentOS = currentQuestion.incorrectOS;

          this.feedbackShow = true;
          this.btnAccept = false;
          this.disableInput = true;
          this.btnReset = true;
          this.btnShowCorrect = true;
          this.isCorrect = false;
        }

        if (this.feedbackType === 'diagnostics') {
          this.counterCorrect = selectAnswer;
        }

      } else if (currentQuestion.type === 'textInput') {
        this.disableInput = true;
        if (this.answerInput.toLowerCase() === currentAnswer[0].text.toLowerCase()) {
          this.counterCorrect++;
        }
        this.feedbackShow = true;
        this.btnAccept = false;
      }

      if (this.feedbackType === 'diagnostics' && this.continueSlide) {
        if (this.counterQuestion === this.testArray.length - 1) {

          this.testCallback(this.counterCorrect);
          $('.js-hide-content-test').show();
        }
      }
      if (this.checkAnswer) {
        /*Смотрим нужно ли выводить фидбек после принятия ответа*/
        if (this.feedbackType === 'femaleDialog' || this.feedbackType === 'maleDialog' || this.feedbackType === 'maleDialogChecked') {
          this.testCallback();
        } else {
          /*Скрываем кнопку принять ответ*/
          this.btnAccept = false;
          /*Блокируем ответы*/
          this.disableInput = true;

          /*Показываем кнопку продолжить*/
          if (this.testArray.length !== this.counterQuestion + 1) {
            this.btnNext = true;
          } else {
            this.feedbackShow = true;
            this.btnNext = true;
          }
        }
      } else {

        /*Переходим к следующему вопросу*/
        if (this.testArray.length !== this.counterQuestion + 1) {
          this.nextQuestion();
        } else {

          this.btnAccept = false;
          this.feedbackShow = true;

          if (this.feedbackType === 'ancet') {
            if (this.testArray.length === this.counterQuestion + 1) {
              this.testCallback(this.counterCorrect);
            }
          }
        }
      }

      // if (this.feedbackType === 'diagnostics' && this.continueSlide) {
      //   if (this.counterQuestion === this.testArray.length) {
      //     this.testCallback(this.counterCorrect);
      //     $('.js-hide-content-test').show();
      //   }
      // }

      if (this.feedbackType === 'contextBlock' || this.feedbackType === 'dontCorrect') {
        this.btnNext = true;
      }

      if (this.feedbackType === 'maleDialog') {
        this.btnNext = false;
        this.testCallback();
      }

      if ((this.feedbackType === 'femaleDialogChecked' || this.feedbackType === 'maleDialogChecked') && this.counterCorrect === 1) {
        this.nextQuestion();
      }

      return this.counterCorrect
    },
    /*Следующий вопрос*/
    nextQuestion: function () {

      // if (this.feedbackType === 'femaleDialogChecked' || this.feedbackType === 'maleDialogChecked' || this.feedbackType === 'contextBlock') {
      //   this.testCallback();
      // }

      if (this.testArray.length - 1 === this.counterQuestion) {

        if (!this.continueSlide) {
          nextSlide();
        } else {

          if (this.feedbackType === 'ancet') {
            this.counterQuestion++;
          }

          this.btnNext = false;
          this.btnReset = false;
          this.btnShowCorrect = false;
          this.testCallback();
          // $('.js-hide-content-test').show();
        }
      } else {
        this.counterQuestion++;

        /*Очищаем временное хранилище*/
        this.tempStorage.type = '';
        this.tempStorage.items = [];
        this.disableInput = false;
        this.btnNext = false;
        this.feedbackShow = false;
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
    },
    /*Перезаписать тестирование*/
    resetQuestion: function () {
      this.feedbackShow = false;
      this.disableInput = false;
      this.btnNext = false;

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
        // $('.js-hide-content-test').show();
      }
    },
  },
});
Vue.component("vTest", {
  template: "#v-test-template",
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
    /* Показывать кнопку Узнать ответ */
    showCorrect: Boolean,
    /* Показывать номер вопроса */
    questionNum: Boolean,
    /* Ticks and checkboxes */
    tick: Boolean,
    /* Test type */
    testType: String,
    attempt: Number,
    testCallback: {
      type: Function,
    },
  },
  data: function () {
    return {
      currentOS: "",
      /*Текущий вопрос*/
      counterQuestion: 0,
      /*Щетчик правельных ответов*/
      counterCorrect: 0,
      /*Временное хранилище вопросов*/
      tempStorage: {
        type: "",
        items: [],
      },
      btnReset: false,
      /* Узнать ответ */
      btnShowCorrect: false,
      /*Принять ответ*/
      btnAccept: false,
      /*Следующий вопрос*/
      btnNext: false,
      /*Обратная связь*/
      feedbackShow: false,
      /*Блокировка ответов*/
      disableInput: false,
      isCorrect: false,
      counterAttempt: 0,
      isTicked: false,
    };
  },
  computed: {
    /*Перемешиваем массив*/
    testArray: function () {
      return this.shuffling(this.questionStorage);
    },
  },
  methods: {
    // sayHi: function () {
    //   console.log('Hi');
    // },
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
          });
        });
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
      if (type === "radio") {
        /*добавдяем выбранный элемент во временное хранилище*/
        this.tempStorage.items = key;

        currQuestion.answers.forEach(function (answer, key) {
          answer.selected = false;
        });

        currAnswer.selected = true;
      } else if (type === "checkbox") {
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
      this.counterAttempt++;

      this.isTicked = true;

      /*Проверяем тип принятого вопроса*/
      if (currentQuestion.type === "radio") {
        var correctAnswer = false;
        var answerFeedback = "";

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
          this.counterCorrect++;
          if (currentQuestion.correctOS !== "") {
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
          if (currentQuestion.incorrectOS !== "") {
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

          if (this.feedbackType === "toNext") {
            this.btnNext = true;
          }
        }
      } else if (currentQuestion.type === "checkbox") {
        var correctAnswer = 0;
        var selectAnswer = 0;
        var selectCorrectAnswer = 0;

        /*Проверяем колличество верных ответов*/
        currentAnswer.forEach(function (answer, key) {
          if (answer.correct) {
            correctAnswer++;
          }
          if (answer.selected) {
            selectAnswer++;

            if (answer.correct) {
              selectCorrectAnswer++;
            }
          }
        });

        /*если все ответы верные присваиваем балл*/
        if (correctAnswer === selectCorrectAnswer && correctAnswer === selectAnswer) {
          this.counterCorrect++;

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
      }

      /*Смотрим нужно ли выводить фидбек после принятия ответа*/
      if (this.checkAnswer) {
        if (this.feedbackType === "femaleDialog" || this.feedbackType === "toNext" || this.feedbackType === "maleDialog") {
          if (!this.continueSlide) {
            this.btnNext = true;
          } else {
            this.btnNext = false;
          }
          this.testCallback();
        } else {
          /*Скрываем кнопку принять ответ*/
          this.btnAccept = false;
          /*Блокируем ответы*/
          this.disableInput = true;

          /*Показываем кнопку продолжить*/
          if (this.testArray.length !== this.counterQuestion + 1) {
            if (!this.continueSlide) {
              this.btnNext = true;
            } else {
              this.btnNext = false;
            }
          } else {
            this.feedbackShow = true;
          }
        }
      } else {
        /*Переходим к следующему вопросу*/
        if (this.testArray.length !== this.counterQuestion + 1) {
          this.nextQuestion();
        } else {
          this.btnAccept = false;
          this.feedbackShow = true;

          if (this.feedbackType === "ancet") {
            if (this.testArray.length === this.counterQuestion + 1) {
              this.testCallback(this.counterCorrect);
            }
          }
        }
      }

      if (this.feedbackType === "contextBlock" && this.feedbackShow) {
        if (this.testArray.length !== this.counterQuestion + 1) {
          this.btnNext = false;
          this.btnShowCorrect = true;
        }
        if (this.isCorrect) {
          this.btnNext = true;
        }
        if (this.showCorrect) {
          this.btnShowCorrect = true;
        } else {
          this.btnShowCorrect = false;
        }
      }
      if (this.feedbackType === "dontCorrect" && this.feedbackShow) {
        this.btnNext = true;
      }

      if (this.feedbackType === "empty") {
        this.testCallback();
      }
      //   if (this.feedbackType === 'femaleDialogChecked' && this.counterCorrect === 1 && !this.storyMod) {
      //       this.nextQuestion();
      // }

      if (this.feedbackType === "femaleDialogChecked" && this.storyMod) {
        this.feedbackShow = true;
        this.btnNext = false;

        if (this.isCorrect) {
          this.btnNext = true;
        }
      }
      // if (this.testArray.length === this.counterQuestion ) {
      //     console.log("IN");

      //     if (this.feedbackType === 'ancet') {
      //         this.testCallback(this.counterCorrect);
      //     }
      // }

      return this.counterCorrect;
    },
    /*Следующий вопрос*/
    nextQuestion: function () {
      if (this.attempt) {
        this.counterAttempt = 0;
      }

      if (this.feedbackType === "femaleDialogChecked") {
        this.testCallback();
      }

      if (this.feedbackType === "contextBlock") {
        this.testCallback();
      }

      if (this.testArray.length - 1 === this.counterQuestion) {
        if (!this.continueSlide) {
          nextSlide();
        } else {
          this.btnNext = false;
          this.btnReset = false;
          this.btnShowCorrect = false;
          // $('.js-hide-content-test').show();
          this.testCallback();

          if (this.feedbackType === "ancet") {
            this.counterQuestion++;
          }
        }
      } else {
        this.counterQuestion++;

        /*Очищаем временное хранилище*/
        this.tempStorage.type = "";
        this.tempStorage.items = [];
        this.btnReset = false;
        this.btnShowCorrect = false;
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
          });
        }
      });

      this.currentOS = this.testArray[this.counterQuestion].postmetoOS;
      this.isCorrect = true;

      if (this.feedbackType === "femaleDialogChecked" && this.continueSlide) {
        this.btnReset = false;
        this.btnShowCorrect = false;
        this.testCallback();
      } else {
        this.btnNext = true;
        // this.isCorrect = true;
      }
    },
    /*Перезаписать тестирование*/
    resetQuestion: function () {
      this.feedbackShow = false;
      this.disableInput = false;
      this.btnNext = false;
      this.btnReset = false;

      /*Убираем состояние селект*/
      this.testArray.forEach(function (items, key) {
        if (items.type !== "sortable") {
          items.answers.forEach(function (answer, key) {
            answer.selected = false;
          });
        }
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
        });
      });
    },
    nextSlide: function () {
      if (!this.continueSlide) {
        nextSlide();
      } else {
        this.btnNext = false;
        $(".js-hide-content-test").show();
      }
    },
  },
});

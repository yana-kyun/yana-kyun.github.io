Vue.component('vScoreInputTest', {
  template: '#v-score-input-test',
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
    /* Text input value */
    testCallback: {
      type: Function
    },
  },
  data: function () {
    return {
      // currentOS: '',
      /*Текущий вопрос*/
      counterQuestion: 0,
      /*Щетчик правельных ответов*/
      counterCorrect: 0,
      /*Временное хранилище вопросов*/
      // tempStorage: {
      //     type: '',
      //     items: []
      // },
      btnReset: false,
      // btnShowCorrect: false,
      /*Принять ответ*/
      btnAccept: false,
      /*Следующий вопрос*/
      btnNext: false,
      /* Сбросить */
      btnReset: false,
      /*Обратная связь*/
      feedbackShow: false,
      /*Блокировка ответов*/
      disableInput: false,
      answerInput: '',
      inputValueSum: 0,
      inputIsValid: true,
      numberInput: [{
          id: 0,
          score: '',
          prevValue: 0
        },
        {
          id: 1,
          score: '',
          prevValue: 0
        },
        {
          id: 2,
          score: '',
          prevValue: 0
        },
        {
          id: 3,
          score: '',
          prevValue: 0
        },
        {
          id: 4,
          score: '',
          prevValue: 0
        },
        {
          id: 5,
          score: '',
          prevValue: 0
        },
        {
          id: 6,
          score: '',
          prevValue: 0
        },
        {
          id: 7,
          score: '',
          prevValue: 0
        },
      ],
      resultArray: [{
          id: 0,
          score: 0,
        },
        {
          id: 1,
          score: 0,
        },
        {
          id: 2,
          score: 0,
        },
        {
          id: 3,
          score: 0,
        },
        {
          id: 4,
          score: 0,
        },
        {
          id: 5,
          score: 0,
        },
        {
          id: 6,
          score: 0,
        },
        {
          id: 7,
          score: 0,
        },
      ],
      isCorrect: false
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

    handleTextInput: function (event) {
      let answerValue = event.target.value;
      answerValue.length !== 0 ? this.btnAccept = true : this.btnAccept = false;
    },

    setPrevValue: function (idx, event) {

      // console.log(event);

      this.numberInput[idx].prevValue = event.target.value;

    },

    handleNumberInput: function (idx) {

      this.inputValueSum -= this.numberInput[idx].prevValue;

      const maxScore = this.testArray[this.counterQuestion].maxScore;

      let filledInputsLength = this.numberInput.filter(input => input.score !== '').length;
      // console.log(filledInputsLength);

      // Get input value
      let inputValue = +this.numberInput[idx].score;

      this.numberInput[idx].prevValue = this.numberInput[idx].score;

      // let remainingValue = maxScore - this.inputValueSum;
      // console.log(remainingValue);

      if (inputValue >= 1 && inputValue <= maxScore - this.inputValueSum) {
        this.inputValueSum += inputValue;

      } else {
        this.numberInput[idx].score = '';
      }

      if (this.inputValueSum === maxScore) {
        // console.log(876);

        if (filledInputsLength <= 5) {
          this.disableInput = true;
          this.btnAccept = true;
          this.btnReset = true;
        } else {
          // this.validateInput();
          this.btnReset = true;
        }
      }

    },
    validateInput: function () {

      document.querySelectorAll('input[type="number"]').forEach(input => {
        // console.log(input);
        if (input.value == 1) {
          input.classList.add('invalid');
          // console.log();
          this.inputIsValid = false;
          // return false;
        }
        // this.inputIsValid = true;
        // return true;
      });
    },
    /*Принять ответ*/
    acceptAnswer: function () {
      this.validateInput();
      /*Текущий вопрос*/
      var currentQuestion = this.testArray[this.counterQuestion];
      // var currentAnswer = currentQuestion.answers;



      if (currentQuestion.type === 'textInput') {
        this.disableInput = true;
        if (this.answerInput.toLowerCase() === currentAnswer[0].text.toLowerCase()) {
          this.counterCorrect++;
        }
        this.feedbackShow = true;
        this.btnAccept = false;
      }

      if (currentQuestion.type === 'numberInput' && this.inputIsValid) {
        this.disableInput = true;

        this.btnAccept = false;
        this.btnNext = true;
      } else {
        // this.btnReset = true;
        this.btnAccept = false;
      }


      /*Переходим к следующему вопросу*/
      if (this.testArray.length !== this.counterQuestion + 1) {

        // this.nextQuestion();
      } else {

        this.btnAccept = false;
        this.btnNext = true;
        // this.feedbackShow = true;

      }

      return this.counterCorrect
    },

    /* Update relult array with current question scores */
    updateResult: function () {
      this.resultArray.forEach(item => {
        item.score += +this.numberInput[item.id].score;
      });
    },

    /* Reset current question inputs */
    resetNumberInput: function () {
      this.numberInput.forEach(item => {
        item.score = '';
        item.prevValue = 0;
      });
      document.querySelectorAll('input[type="number"]').forEach(input => {
        input.classList.remove('invalid');
      });
      this.inputIsValid = true;
      this.disableInput = false;
      this.inputValueSum = 0;
      this.btnAccept = false;
      this.btnReset = false;
    },

    /*Следующий вопрос*/
    nextQuestion: function () {
      this.inputIsValid = true;
      this.inputValueSum = 0;
      this.updateResult();
      this.resetNumberInput();
      this.btnReset = false;

      if (this.testArray.length - 1 === this.counterQuestion) {

        if (!this.continueSlide) {
          nextSlide();
        } else {

          this.btnNext = false;
          this.btnReset = false;
          this.testCallback(this.resultArray);
          nextSlide();
        }
      } else {
        this.counterQuestion++;

        /*Очищаем временное хранилище*/
        // this.tempStorage.type = '';
        // this.tempStorage.items = [];
        this.disableInput = false;
        this.btnNext = false;
        this.feedbackShow = false;
      }

    },
    // showCorrectQuestion: function() {
    //     let th = this;

    //     this.testArray.forEach(function (items, key) {
    //         if (key === th.counterQuestion) {
    //             items.answers.forEach(function (answer, key) {
    //                 if (answer.correct) {
    //                     answer.selected = true;
    //                 } else {
    //                     answer.selected = false;
    //                 }
    //             })
    //         }
    //     });

    //     this.currentOS = this.testArray[this.counterQuestion].postmetoOS;

    //     this.btnNext = true;
    //     this.isCorrect = true;
    // },
    /*Перезаписать тестирование*/
    // resetQuestion: function () {

    //     this.inputValueSum = 0;
    //     this.feedbackShow = false;
    //     this.disableInput = false;
    //     this.btnNext = false;

    // },
    /*Перезаписать тестирование*/
    // resetTest: function () {
    //     this.feedbackShow = false;
    //     this.counterQuestion = 0;
    //     this.counterCorrect = 0;
    //     this.disableInput = false;

    // },
    nextSlide: function () {

      if (!this.continueSlide) {
        nextSlide();
      } else {
        this.btnNext = false;
      }
    },
  },

});
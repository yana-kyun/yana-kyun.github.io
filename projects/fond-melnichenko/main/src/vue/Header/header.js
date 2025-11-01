Vue.component('navigation', {
  template: '#navigation-template',
  props: {
    navItems: Array,
    contentShow: Boolean,
  },
  data: function () {
    return {
      countActiveItem: 0,
      activeItems: 0,
      activeItem: 0,
    }
  },
  watch: {
    contentShow: {
      handler: function (newValue, oldValue) {
        var $content = $('.container-scroll.js-container-scroll.scroll-content');
        var $items = $('.js-item-scroll:visible');
        var th = this;

        th.activeItems = getSlidePosition().current - 1;
        $items.each(function (key, item) {
          if ($content.scrollTop() + 10 >= item.offsetTop && $content.scrollTop() < item.offsetTop + item.offsetHeight) {
            th.activeItem = key;
          }
        });

        this.activeSlide();

      }
    }
  },
  methods: {
    gotoSlide: function (link, currentLink) {
      if (!link.disable && !currentLink) {
        this.hideNav();

        gotoFrame(link.slide);
      }
    },
    hideNav: function () {
      this.$emit("updateContentShow", false)
    },
    scrollTitle: function (key, frame, current) {
      var thisVue = this;

      // if ($('.js-item-scroll:visible').length !== 0) {
      if (!current) {
        this.gotoSlide(frame);
      }


      var $content = $('.container-scroll.js-container-scroll.scroll-content');
      var $items = $('.js-item-scroll:visible');
      var $rows = $('.container:visible');
      console.log($rows);

      thisVue.hideNav();
      if ($items[key]) {
        setTimeout(() => {
          $content.animate({
            scrollTop: $items[key].offsetTop
          }, 400);
        }, 300);
        $content.scroll(function () {
          $items.each(function (key, item) {
            if ($content.scrollTop() + 10 >= item.offsetTop && $content.scrollTop() < item.offsetTop + item.offsetHeight) {
              thisVue.activeItem = key
            }
          })
        });
      } else {
        let scrollHeight = document.querySelectorAll('.js-container-scroll')[1].scrollHeight;
        setTimeout(() => {
          $content.animate({
            scrollTop: scrollHeight
          }, 400);
        }, 300);
        $content.scroll(function () {
          $rows.each(function (key, item) {
            if ($content.scrollTop() + 10 >= item.offsetTop && $content.scrollTop() < item.offsetTop + item.offsetHeight) {
              thisVue.activeItem = key
            }
          })
        });
      }

      // } else {
      //   thisVue.hideNav();
      // }

      return false;
    },
    activeSlide: function () {
      var th = this;
      th.countActiveItem = 0;

      $('.slide-list').find('.slide-item').each(function (key, item) {
        if ($(item).hasClass('visited')) {

          // $($('.navigation__item')[key]).addClass('active');
          th.navItems[key].active = true;
        }
      })
    }
  }

});


Vue.component('glossary', {
  template: '#glossary-template',
  props: {
    glossaryWords: Array
  },
  data: function () {
    return {
      activeItem: 0
    }
  },
  computed: {
    glossaryData: function () {

      var glossaryCopy = this.glossaryWords.slice();

      var glossaryTitles = [];
      for (var i = 0; i < glossaryCopy.length; i++) {
        var firstCharacter = glossaryCopy[i].name.slice(0, 1);
        if (glossaryTitles.indexOf(firstCharacter) === -1) {
          glossaryTitles.push(firstCharacter);
        }
      }

      glossaryTitles.sort(function (a, b) {
        return a.localeCompare(b);
      });

      var glossaryData = [];
      var glossaryTempData = [];

      for (var i = 0; i < glossaryTitles.length; i++) {
        glossaryTempData = [];
        for (var j = 0; j < glossaryCopy.length; j++) {
          if (glossaryCopy[j].name.indexOf(glossaryTitles[i]) === 0) {
            glossaryTempData.push(glossaryCopy[j]);
          }
        }
        glossaryData.push({
          title: glossaryTitles[i],
          data: glossaryTempData
        });
      }

      return glossaryData;
      //return this.filterGlossary(this.glossaryWords);
    },
  },
  methods: {
    filterGlossary: function (words) {
      var data = words.slice();
      var newData = [];
      var glossaryLetters = [];

      //Заполняем массив перывми буквами слов
      data.forEach(function (word, key) {
        var firstLetter = word.slice(0, 1);

        if (glossaryLetters.indexOf(firstLetter) === -1) {
          glossaryLetters.push(firstLetter);
        }
      });

      //Сортируем массив первых букв по алфовиту
      glossaryLetters.sort();

      //Собираем новый массив из обьектов
      glossaryLetters.forEach(function (letter, key) {
        var temporary = [];

        data.forEach(function (word) {
          var firstLetter = word.slice(0, 1);

          if (letter === firstLetter) {
            temporary.push(word);
          }
        });

        newData.push({
          firstLetter: letter,
          words: temporary
        })
      });

      return newData;
    },
    scrollWord: function () {
      var $content = $('.glossary__content');
      var $links = $('.glossary__link');
      var $items = $('.glossary__item');
      var thisVue = this;
      $links.each(function (key, link) {
        $(link).bind('click', function () {
          $content.animate({
            scrollTop: $items[key].offsetTop
          }, 400);

          return false;
        })
      });

      $content.scroll(function () {
        $items.each(function (key, item) {
          if ($content.scrollTop() + 10 >= item.offsetTop && $content.scrollTop() < item.offsetTop + item.offsetHeight) {
            thisVue.activeItem = key
          }

        })
      });
    }
  },
  mounted: function () {
    // this.scrollWord();
    // $('.js-scroll').each(function () {
    //   $(this).scrollbar();
    // });
  },
});

Vue.component('materials', {
  template: '#materials-template',
  props: {
    materials: Array
  },
  methods: {
    hello: function () {

    },
    handleMaterial: function (material) {
      window.open(material.link, '_blank', 'width=' + screen.availWidth + ', height=' + screen.availHeight);
    }
  }
});


Vue.component('vHeader', {
  template: '#v-header-template',
  props: {
    glossary: Array,
    navigation: Array,
    materials: Array,
    materialOff: Boolean,
    glossaryOff: Boolean,
  },
  data: function () {
    return {
      content: {
        show: false
      },
      currentTab: 'navigation'
    }
  },
  methods: {
    showNav: function () {
      if (this.content.show === false) {
        this.content.show = true;

      } else {
        this.content.show = false;
        scrollbar();
      }

      this.currentTab = 'navigation';
    },
    updateContentShow: function (status) {
      return this.content.show = status;
    },
    selectTab: function (component) {
      this.currentTab = component;
    }
  }
});


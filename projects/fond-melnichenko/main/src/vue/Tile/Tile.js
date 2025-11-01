Vue.component('vTile', {
    template: '#v-tile-template',
    props: {
        imgGender: String,
        htmlLogic: Boolean,
        imgTypeProd: Boolean,
    },
    data: function () {
      return {
      age: 16,
      ageReal: 16,  
      }
    },
    methods: {
        tile: function() {
            const tile = document.querySelectorAll('.js-tile'),
            defaultTile = document.querySelectorAll('.js-tile-default'),
            unlockedTile = document.querySelectorAll('.js-tile-unlocked'),
            receivedTile = document.querySelectorAll('.js-tile-received')
            personImgHtml = document.querySelector('.js-person-tile'),
            ageHtml = document.querySelector('.js-age'),
            gender = document.querySelector('.main-people'),
            ageNameHtml = document.querySelector('.js-age-name');
            // let age = 16;
            if (this.htmlLogic==true)
            {
                tile.forEach((item, index) => {
                    if (item.classList.contains('js-tile-active')) {
                        defaultTile[index].classList.add('hide');
                        unlockedTile[index].classList.remove('hide');
                    }
                })
            }
            
            unlockedTile.forEach((item, index) => {
                item.addEventListener("click", () => {
                    
                    this.resultYears(item, index, receivedTile, tile)

                })
            })
        },
        resultYears(item, index, receivedTile, tile) {
            if (this.htmlLogic==true)
                {
                    item.classList.add('hide');
                    receivedTile[index].classList.remove('hide');
                }
                
                this.age = this.age + parseInt(tile[index].getAttribute('data-number-of-years'));
                ageHtml.textContent = this.ageReal;
                const lastDigit = this.ageReal % 10;
                
                if (this.ageReal % 100 >= 11 && this.ageReal % 100 <= 14) {
                    ageNameHtml.textContent = "лет";
                } else if (lastDigit === 1) {
                    ageNameHtml.textContent = "год";
                } else  if (lastDigit >= 2 && lastDigit <= 4) {
                    ageNameHtml.textContent = "года";
                } else {
                    ageNameHtml.textContent = "лет";
                }
                
                if (this.ageReal <= 22) {
                    personImgHtml.src = 'user/img/person-tile/img-' + this.imgGender + '-1.png';
                } else if (this.ageReal >= 35) {
                    personImgHtml.src = 'user/img/person-tile/img-' + this.imgGender + '-3.png';
                } else {
                    if (this.imgTypeProd == true) {
                        console.log(1);
                        personImgHtml.src = 'user/img/person-tile/img-' + this.imgGender + '-4.png';
                    } else {
                        console.log(3);
                        personImgHtml.src = 'user/img/person-tile/img-' + this.imgGender + '-2.png';
                    }
                }
                
                this.ageReal = this.age;
        }
    },
    mounted: function () {
        this.tile();
        let th = this
        eventBus.$on('years', function (idx) {
            let ageHtml = document.querySelector('.js-age'),
                personImgHtml = document.querySelector('.js-person-tile');
            th.ageReal = idx;
            th.age = idx;
            ageHtml.textContent = th.ageReal;
            personImgHtml.src = 'user/img/person-tile/img-' + th.imgGender + '-1.png';
            ageNameHtml.textContent = "лет";
        });
        
    },
  });
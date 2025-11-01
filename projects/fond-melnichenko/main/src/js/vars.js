// slideCounter
var slideCounter = {
    fn: function () {
        var total = getSlidePosition()["total"];
        var current = getSlidePosition()["current"];

        $('.js-curSlide').html(current);
        $('.js-allSlide').html(total);
    }
};

// progressbar
var progressbar = {
    fn: function () {
        var total = getSlidePosition()["total"];
        var current = getSlidePosition()["current"];

        $('.header__progressbar_info-line').each(function () {
            $(this).css('width', 100 / total * current + '%');
        });
    }
};

// headerTitle
var slideTitle = {
    fn: function () {
        var title = getSlideTitle();

        $('.js-header-title').html(title);
    }
};

//Анимация при скролле
function onScrollContent() {
    var contentHeight = $('.container-scroll:visible')[0].clientHeight;
  
    $('.container-scroll:visible').on("scroll", function () {
  
      $(".animate__animated").each(function () {
        var offset_top = $(this).offset().top;

        if (offset_top > 0) {
            var animItem = $(this).hasClass("hidden");
  
            if (offset_top < contentHeight / 1.1 && animItem) {
              $(this).removeClass('hidden');
            }
        }

      });

    });
}


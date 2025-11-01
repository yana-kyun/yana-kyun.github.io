function scalize() {
  $('.scalize').scalize({
    styleSelector: 'circle',
    getSelectorElement: function (el) {
      $(el).addClass('vis');
      $('.item-point.active').not($(el)[0]).find('.toggle').click();
    },
    onInit: function () {

    }
  });
}
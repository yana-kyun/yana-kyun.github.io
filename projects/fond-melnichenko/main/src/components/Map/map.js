function mapInitialize() {
  $('.item-point').each(function (key, item) {
    if (typeof CLV !== 'undefined') {
      if (CLV.oGlobal['map_' + key + ''] == true) {
        $(this).addClass('vis');
        $('.map-button').eq(key).addClass('vis');

        $('.js-hide-content').show();
      }
    }

  });
}
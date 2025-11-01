function initTabs() {
    $('.js-tab').each(function () {
        var btn = $(this).find('.js-tab-link');
        var item = $(this).find('.js-tab-item');
        var _this = $(this)

        $(btn).on('click', function () {
            var keyItem = $(this).index();
            var curBtn = $(this);

            $(btn).removeClass('active');
            $(curBtn).addClass('vis');
            $(_this).addClass('vis');

            $(item).each(function (key, item) {
                if (key === keyItem) {
                    $(curBtn).addClass('active');
                    $(item).show();
                } else {
                    $(item).hide();
                }
            })

            // if ($(btn).length > 0 && $(btn).length == $(this).find('.js-tab-link.vis')) {
            //     $('.js-tab-top').hide();
            // }
        });
    })
}

function initPickRound() {
    $('.js-pickRound').each(function () {
        let item = $(this).find('.js-pickRound-item'),
            speech = $(this).find('.js-pickRound-speech');

        $(item).click(function () {
            $(speech).toggleClass('hide');
        });
    });
}
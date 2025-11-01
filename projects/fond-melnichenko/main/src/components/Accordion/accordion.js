function initAccordion() {
    $('.js-accordion').each(function () {
        var accordion = $(this);
        var collapse = $(this).attr('data-collapse');
        var btn = $(accordion).find('.accordion__title');
        var container = $(accordion).find('.accordion__container');

        btn.each(function(index, element) {
            $(element).on('click', function () {
                if (collapse) {
                    $(this).next(container).slideToggle(300);
                    $(container).not($(this).next(container)).slideUp(300);
                } else {
                    if ($(this).hasClass("show")) {
                        $(this).removeClass("show").next().slideUp(300);
                    } else {
                        $(this).toggleClass("show").next().slideToggle(300);
                    }
                    return false;
                }
            });
        });
    });
}

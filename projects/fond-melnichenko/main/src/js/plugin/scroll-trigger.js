function scrollTrigger({scrollElem, elClass, positionStart, positionBottom}) {
    $(scrollElem+':after').css({
        "content": '123'
    });
    $(scrollElem).scroll(function () {
    });
}
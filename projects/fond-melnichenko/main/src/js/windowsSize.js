if (window.addEventListener) {
    window.addEventListener("load", function () {
        change_viewport();
    });

    window.addEventListener("resize", function () {
        change_viewport();
    });
} else {
    window.attachEvent("onload", function () {
        change_viewport();
    });

    window.attachEvent("onresize", function () {
        change_viewport();
    });
}


// ShutdownModule
function ShutdownModule() {}

// Проверка размера окна
function change_viewport() {
    if (window.screen.width >= 719) {
        $("meta[name = viewport]").attr("content", "width=1280, initial-scale=1, maximum-scale=1, user-scalable=1");
    } else if (window.screen.width <= 375) {
        $("meta[name = viewport]").attr("content", "width=375,initial-scale=1");
    } else {
        $("meta[name = viewport]").attr("content", "width=device-width, initial-scale=1");
    }
}
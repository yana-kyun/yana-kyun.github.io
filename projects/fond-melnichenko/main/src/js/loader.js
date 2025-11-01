var gsapAnimation = {

    fn: function (marcker, position, func, path) {

        // $('.cl-board-frame').addClass('load');

        var imgs = document.querySelectorAll('img');
        var completeLoadImg = [];

        function loaded(img) {

            completeLoadImg.push(img);

            if (completeLoadImg.length === imgs.length) {


                if (func !== '') {
                    console.log('lunch functon')

                    setTimeout(() => {
                        func(marcker, position, path)
                    }, 300);
                }

                // if (func_2 !== '') {
                //     setTimeout(() => {
                //         func_2(marcker_2, position_2)
                //     }, 400);
                // }

            }
            else {
                // console.log('У меня мало')
            }
        }

        function loader(img) {
            if (img.complete) {
                loaded('img');
            } else {
                img.addEventListener('load', loaded)
                img.addEventListener('error', loaded)
                img.addEventListener('error', function () {
                    // console.error('error')
                })
            }
        }

        imgs.forEach(function (img, key) {
            loader(img)
        });
    }
}


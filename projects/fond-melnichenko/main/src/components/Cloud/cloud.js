function initClouds() {
    let selectedClouds = [];
    document.querySelectorAll('.js-cloud-group').forEach((cloudGroup, indexGroup) => {
        cloudGroup.querySelectorAll('.cloud').forEach((cloud, index) => {

            cloud.addEventListener('click', (e) => {
                if (!cloudGroup.classList.contains('cloud-group_done')) {
                    // Запомнить выбранное облако
                    selectedClouds.push(cloud);
                    updateCloudsSummary();

                    if (window.innerWidth <= 719) {
                        index=index-3;
                    }

                    console.log(index+ " "+ indexGroup);
                    

                    // Пройти дальше
                    document.querySelector(`[data-hidden-contant="${cloudGroup.dataset.contentAfter}"]`).classList.remove('vis-hidden', 'hidden-contant');
                    updateGsapCenter();
                    document.querySelectorAll('.js-cloud-group-os')[indexGroup].querySelectorAll('.js-cloud-os')[index].classList.remove('vis-hidden')

                    // Действия для десктопа и мобилки
                    const container = cloudGroup.closest('.container');
                    container.querySelectorAll('.js-cloud-subgroup').forEach(element => {
                        element.classList.add('cloud-group_done');
                        element.querySelectorAll('.cloud')[index].classList.add('cloud_selected');
                        element.querySelectorAll('.cloud')[index].querySelector('.cloud__state_hover').classList.add('hide')

                        // Спрятать невыбранные облака
                        hideOtherClouds(element);
                    });
                    
                    if (indexGroup == 0) {
                        document.querySelectorAll('.js-cloud-group-os-end')[indexGroup].querySelectorAll('.js-cloud-os')[index].classList.remove('vis-hidden')
                    }
                    
                }
            });

            // Анимация покачивания облаков
            const ani = gsap.timeline();

            ani.to(cloud,
                {
                    duration: 6,
                    ease: "power1.inOut",
                    immediateRender: true,
                    repeat: -1,
                    repeatDelay: 0,
                    yoyo: true,
                    delay: Math.random() * 6,
                    motionPath:
                    {
                        path: [
                            { x: 0, y: -2 },
                            { x: 5, y: 0 },
                            { x: 0, y: 2 },
                            { x: -5, y: 0 },
                        ]
                    }
                }
            );
        });
    });

    function hideOtherClouds(group) {
        group.querySelectorAll('.cloud').forEach(otherCloud => {
            if (!otherCloud.classList.contains('cloud_selected')) {
                gsap.killTweensOf(otherCloud);
                otherCloud.classList.add('animate__animated');
                otherCloud.classList.add(otherCloud.dataset.animationOut);
            }
        });
    }

    function updateCloudsSummary() {
        const cloudSummary = document.querySelectorAll('.js-cloud-group_summary');
        cloudSummary.forEach(summaryElem => {
            const summaryElements = summaryElem.querySelectorAll('.cloud');

            summaryElements.forEach((element, index) => {
                if (selectedClouds[index]) {
                    element.querySelector('img.cloud__state').src = selectedClouds[index].querySelector('img.cloud__state_selected').src;
                }
            });
        });
    }
}
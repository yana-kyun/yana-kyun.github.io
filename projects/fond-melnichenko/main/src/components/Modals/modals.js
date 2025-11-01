function initModal() {
    let scrollFunc = function() {
        ps.element.scrollTop = ps.lastScrollTop;
    };

    const btn_modal = document.querySelectorAll('.js-btn-modal'),
    modal = document.querySelectorAll('.js-pm-modal'),
    btn_modal_close = document.querySelectorAll('.js-pm-modal-close');
    

    btn_modal.forEach(function(item, i) {
        item.addEventListener('click', () => {
            modal[i].classList.remove('hide');
            console.log(modal[i]);
            
        })
    })

    btn_modal_close.forEach(function(item, i) {
        item.addEventListener('click', () => {
            modal[i].classList.add('hide');
        })
    });

    const btnModalOverlay = document.querySelectorAll('.js-btn-modal-overlay'),
    modalOverlay = document.querySelectorAll('.js-pm-modal-overlay'),
    btnModalCloseOverlay = document.querySelectorAll('.js-pm-modal-close-overlay');

    btnModalOverlay.forEach(function(item, i) {
        item.addEventListener('click', () => {
            modalOverlay[i].classList.remove('hide');
            ps.element.addEventListener('ps-scroll-y', scrollFunc);
        })
    })

    btnModalCloseOverlay.forEach(function(item, i) {
        item.addEventListener('click', () => {
            modalOverlay[i].classList.add('hide');
            ps.element.removeEventListener('ps-scroll-y', scrollFunc);
        })
    });

    modalOverlay.forEach(element => {
        const scroll = element.querySelector('.js-scroll');
        if (!scroll) {
            return;
        }
        new PerfectScrollbar(scroll, {
            wheelSpeed: 0.5,
            wheelPropagation: false,
            swipeEasing: true,
            suppressScrollY: false,
            suppressScrollX: false,
        });
    });

    let globalIndex = 0;
    document.querySelectorAll('.js-modal-btn-container').forEach(container => {
        const buttons = container.querySelectorAll('.js-modal-btn');
        const modals = Array.from(document.querySelectorAll('.js-pm-modal')).slice(globalIndex, globalIndex + buttons.length);

        buttons.forEach((button, index) => {
            button.addEventListener('click', () => {
                modals[index].classList.remove('hide');
            });
        });

        globalIndex += buttons.length;
    });
}
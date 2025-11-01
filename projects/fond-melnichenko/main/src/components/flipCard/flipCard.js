initFlipCard = (fn) => {
  // const btnNext = document.querySelector('.js-btn-next');
  const flipCards = document.querySelectorAll(".js-flipCard");
  const flipCardsVisible = [...flipCards].filter((card) => isVisible(card));
  const flipContainer = document.querySelector(".js-flip");

  // btnNext.classList.add('disabled');

  // If the data-click attribute is present the cards flip on click,
  // otherwise they flip on hover

  checkVisited = () => {
    const flipCardsVisited = document.querySelectorAll(".js-flipCard.vis").length;

    if (flipCards.length === flipCardsVisited) {
      // btnNext.classList.remove('disabled');
      // console.log(flipContainer.parentNode.nextElementSibling);

      flipContainer.parentNode.nextElementSibling.style.display = "block";

      if (fn) {
        runOnce(fn);
      }

      return true;
    }
    return false;
  };

  flipCards.forEach((flipCard) => {
    if (flipCard.hasAttribute("data-click")) {
      flipCard.addEventListener("click", function () {
        this.classList.add("vis");
        this.classList.toggle("flip");
        checkVisited();
      });
    } else {
      flipCard.addEventListener("mouseover", function () {
        this.classList.add("vis noclick");
        this.classList.add("flip");
        checkVisited();
      });

      flipCard.addEventListener("mouseout", function () {
        this.classList.remove("flip");
      });
    }
  });
};

// Visibility check function (:visible alternative)
isVisible = (elem) => {
  return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
}

// initFlipCard();

runOnce = ((fn) => {
  let done = false;
  return function (fn) {
    if (!done) {
      done = true;
      fn();
    }
  };
})();
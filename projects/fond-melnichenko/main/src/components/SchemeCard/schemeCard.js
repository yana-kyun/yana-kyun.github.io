function schemeCards() {
  const schemeBtns = document.querySelectorAll('.js-scheme-btn');

  function showDescription() {
    const targetId = this.dataset.target;
    const targetCard = document.getElementById(targetId);

    targetCard.classList.remove('hide');
  }

  function hideDescription(event) {
    const container = event.target.closest('.js-scheme-container');
    const schemeBtn = container.querySelector('.js-scheme-btn');
    const description = container.querySelector('.js-scheme-description');

    if (!description.contains(event.target) && !schemeBtn.contains(event.target)) {
      description.classList.add('hide');
    }
  }

  schemeBtns.forEach(schemeBtn => schemeBtn.addEventListener('click', showDescription));

  document.addEventListener('click', hideDescription);
}
// const schemeBtns = document.querySelectorAll('.js-scheme-btn');

// function showDescription() {
//   const targetId = this.dataset.target;
//   const targetCard = document.getElementById(targetId);
  
//   targetCard.classList.remove('hide');
// }

// function hideDescription(event) {
//   const container = event.target.closest('.js-scheme-container');
//   const schemeBtn = container.querySelector('.js-scheme-btn');
//   const description = container.querySelector('.js-scheme-description');

//   if (!description.contains(event.target) && !schemeBtn.contains(event.target)) {
//     description.classList.add('hide');
//   }
// }

// schemeBtns.forEach(schemeBtn => schemeBtn.addEventListener('click', showDescription));

// document.addEventListener('click', hideDescription);
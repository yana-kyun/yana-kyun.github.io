window.onload = () => {
  const menuOpen = document.getElementById("burger");
  const menuClose = document.getElementById("close");

  let tlMain = gsap.timeline();
  tlMain
  .from(".hero__title", {opacity: 0, y: 30, delay: 0.5, duration: 1, ease: "power1"})
  .from(".hero__btn", {opacity: 0, y: 30, duration: 1, ease: "power1"}, '<')
  .from(".hero__descr", {opacity: 0, duration: 1, ease: "power1"})
  .from(".photos-wrap img", {opacity: 0, scale: 0.8, duration: 0.7, stagger: 0.2, ease: "power1"}, '<0.3')
  .from(".photos__author", {opacity: 0, duration: 1.5, ease: "power1"}, '<0.8');

  let tlMenu = gsap.timeline({paused: true});
  tlMenu
  .to(".menu", {display: 'block'})
  .fromTo(".menu__top", {opacity: 0, y: -30}, {opacity: 1, y: 0, duration: 0.5, ease: "expo"}, '<')
  .fromTo(".menu__container", {opacity: 0, y: 30}, {opacity: 1, y: 0, duration: 0.5, ease: "expo"}, '<0.3')
  .from(".menu__nav", {opacity: 0, y: 30, duration: 0.4}, '<0.2')
  .from(['.social', '.menu__right'], {opacity: 0, y: 30, duration: 0.5});

  menuOpen.addEventListener('click', () => {
    tlMenu.play();
  });

  menuClose.addEventListener('click', () => {
    tlMenu.reverse();
  });
}

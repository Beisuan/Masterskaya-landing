document.addEventListener('DOMContentLoaded', function () {
  'use strict';
  const loaderTimer = (time) =>
    new Promise((resolve) => {
      const timerId = window.setTimeout(() => {
        resolve(timerId);
      }, time);
    });
  loaderTimer(500).then((timerId) => {
    window.clearTimeout(timerId);
    document.body.classList.add('loaded');
    document.body.classList.remove('loaded_hiding');
  });
});
$(document).ready(function () {
  const slider = $('#slider').owlCarousel({
    items: 1,
    nav: true,
    loop: true,
  });
  document.querySelector('.hamburger').addEventListener('click', function () {
    document.querySelector('.menu').classList.toggle('open');
    document.querySelector('body').classList.toggle('no-scroll');
  });
});

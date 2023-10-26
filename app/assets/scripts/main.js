$(document).ready(function () {
  'use strict';
  const loaderTimer = (time) =>
  new Promise((resolve) => {
    const timerId = window.setTimeout(() => {
      resolve(timerId);
    }, time)
  });
  loaderTimer(500).then((timerId) => {
    window.clearTimeout(timerId);
    $('body').addClass('loaded');
    $('body').removeClass('loaded_hiding');
  });
  $(document).ready(function(){
    $("#slider").owlCarousel();
  });
  document.querySelector('.hamburger').addEventListener('click', function() {
  document.querySelector('.menu').classList.toggle('open');
  });
});

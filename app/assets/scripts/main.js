$(document).ready(function () {
  'use strict';
  window.onload = function () {
  document.body.classList.add('loaded_hiding');
  window.setTimeout(function() {
    document.body.classList.add('loaded');
    document.body.classList.remove('loaded_hiding');
    }, 500);
  };
  $(document).ready(function(){
    $("#slider").owlCarousel();
  });
  document.querySelector('.hamburger').addEventListener('click', function() {
  document.querySelector('.menu').classList.toggle('open');
  });
});

(function () {
  'use strict';
});
$(document).ready(function() {
  $('.hamburger').click(function(){
      $('.hamburger').toggleClass('menu-open');
      $('.menu').toggleClass('open-menu');
  });
});
window.onload = function () {
  document.body.classList.add('loaded_hiding');
  window.setTimeout(function() {
    document.body.classList.add('loaded');
    document.body.classList.remove('loaded_hiding');
  }, 2000);
}
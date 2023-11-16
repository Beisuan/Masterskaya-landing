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
  const boxes = Array.from(document.querySelectorAll(".box")); 
  const slider = $('#slider').owlCarousel({
    items: 1,
    nav: true,
    loop: true,
  });
  document.querySelector('.hamburger').addEventListener('click', function () {
    document.querySelector('.menu').classList.toggle('open');
    document.querySelector('body').classList.toggle('no-scroll');
  });
  boxes.forEach((box) => {
  box.addEventListener("click", boxHandler); 
});

function boxHandler(e) {
  e.preventDefault(); 
  let currentBox = e.target.closest(".box");
  let currentContent = e.target.nextElementSibling;

  
  currentBox.classList.toggle("active"); 
  if (currentBox.classList.contains("active")) {
    currentContent.style.maxHeight = currentContent.scrollHeight + "px"; 
  } else {
    currentContent.style.maxHeight = 0; 
  }
  }
});



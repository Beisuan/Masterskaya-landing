(function () {
  'use strict';
});
const boxes = Array.from(document.querySelectorAll('.box'));

boxes.forEach((box) => {
  box.addEventListener('click', boxHandler);
});

function boxHandler(e) {
  e.preventDefault();
  let currentBox = e.target.closest('.box');
  let currentContent = e.target.nextElementSibling;

  boxes.forEach((elem) => {
    if (elem.classList.contains('active') && elem != currentBox) {
      elem.classList.toggle('active');
      elem.querySelector('div.content').style.maxHeight = 0;
    }
  });

  currentBox.classList.toggle('active');
  if (currentBox.classList.contains('active')) {
    currentContent.style.maxHeight = currentContent.scrollHeight + 'px';
  } else {
    currentContent.style.maxHeight = 0;
  }
}

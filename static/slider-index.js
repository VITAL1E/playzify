(function (window, document, undefined) {
  "use strict";

  let slider = document.querySelector(".slider");
  let buttons = document.querySelectorAll(".btn");
  let slides = document.querySelectorAll(".img-slider");
  let backgrounds = document.querySelectorAll(".bg");
  let options = document.querySelectorAll(".option");

  let index = 1;
  let op_index = 0;
  let size = slides[index].clientWidth;

  update();

  function update() {
    slider.style.transform = "translateX(" + (-size * index) + "px)";

    backgrounds.forEach((img) => img.classList.remove("show"));
    backgrounds[op_index].classList.add("show");

    options.forEach((op) => op.classList.remove("colored"));
    options[op_index].classList.add("colored");
  }

  function slide() {
    slider.style.transition = "transform .5s ease-in-out";
    update();
  }

  function btnCheck() {
    if (this.id === "prev-index") {
      index--;

      if (op_index === 0) {
        op_index = 4;
      } else {
        op_index--;
      }
    } else {
      index++;

      if (op_index === 4) {
        op_index = 0;
      } else {
        op_index++;
      }
    }
    slide();
  }

  function optionFunc() {
    let i = Number(this.getAttribute("op-index"));
    op_index = i;
    index = i + 1;
    slide();
  }

  slider.addEventListener("transitionend", () => {
    if (index >= 4) {
      return;
    }
    if (index <= 0) {
      return;
    }
    console.log(slides[index]);
    if (slides[index].id === "fist-index") {
      slider.style.transition = "none";
      index = slides.length - 2;
      slider.style.transform = "translateX(" + (-size * index) + "px)";
    } 
    else if (slides[index].id === "last-index") {
      slider.style.transition = "none";
      index = 1;
      slider.style.transform = "translateX(" + (-size * index) + "px)";
    }
  });

  buttons.forEach((btn) => btn.addEventListener("click", btnCheck));
  options.forEach((option) => option.addEventListener("click", optionFunc));

  setInterval(btnCheck, 5000);
})(window, document);

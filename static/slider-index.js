(function (window, document, undefined) {
  "use strict";

  document.addEventListener(
    "load",
    function () {
      let slider = document.querySelector(".slider");
      let buttons = document.querySelectorAll(".btn");
      let slides = document.querySelectorAll(".img-slider");
      let backgrounds = document.querySelectorAll(".bg");
      let options = document.querySelectorAll(".option");

      let element = document.getElementById("index-background");
      let numberOfChildren = element.getElementsByTagName("img").length;

      console.log(numberOfChildren);

      let index = 1;
      let op_index = 0;

      let size = slides[index].clientWidth;

      update();

      function update() {
        slider.style.transform = "translateX(" + -size * index + "px)";

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
            op_index = numberOfChildren - 1;
          } else {
            op_index--;
          }
        } else {
          index++;

          if (op_index === numberOfChildren - 1) {
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
        if (index >= numberOfChildren - 1) {
          return;
        }
        if (index <= 0) {
          return;
        }
        if (slides[index].id === "fist-index") {
          slider.style.transition = "none";
          index = slides.length - 2;
          slider.style.transform = "translateX(" + -size * index + "px)";
        } else if (slides[index].id === "last") {
          slider.style.transition = "none";
          index = 1;
          slider.style.transform = "translateX(" + -size * index + "px)";
        }
      });

      buttons.forEach((btn) => btn.addEventListener("click", btnCheck));
      options.forEach((option) => option.addEventListener("click", optionFunc));

      setInterval(btnCheck, 5000);
    },
    5000
  );
})(window, document);

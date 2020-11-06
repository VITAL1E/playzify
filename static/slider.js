let slider = document.querySelector(".slider");
let buttons = document.querySelectorAll(".btn");
let options = document.querySelectorAll(".option");
let slides = document.querySelectorAll(".img-slider");

let index = 1;
let op_index = 0;
let size = slides[index].clientWidth;

update();

function update() {
  slider.getElementsByClassName.transform = "translate(" + (-size * index) + "px)";

  options.forEach(op => op.classList.remove("colored"));
  options[op_index].classList.add("colored");
}

function slide() {
  slider.style.transition = "transform .5s ease-in-out";

  update();
}

function btnCheck() {
  if (this.id === "prev") {
    index--;

    if (op_index == 0) {
      op_index = 3;
    } else {
      op_index--;
    }
  }

  else if (this.id === "next") {
    index++;

    if (op_index == 3 ) {
      op_index = 0;
    } else {
      op_index++;
    }
  }

  slide();
}

function optionFunc() {
  let i = Number(this.getAttribute("option-index"));
  index = i + 1;
  op_index = i;
  slide(); 
}

slider.addEventListener("transitionend", () => {
  if (slides[index].id === "last") {
    slider.style.transition = "none";
    index = slides.length - 2;
    slider.style.transform = "translateX(" + (-size * index) + "px)";
  }

  else if (slides[index].id === "first") {
    slider.style.transition = "none";
    index = 1;
    slider.style.transform = "translateX(" + (-size * index) + "px)";
  }

})


buttons.forEach(btn => btn.addEventListener("click", btnCheck));
options.forEach(option => option.addEventListener("click", optionFunc));
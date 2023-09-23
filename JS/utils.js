import anime from "../node_modules/animejs/lib/anime.es.js";

import {
  bar,
  barPath,
  circle,
  imageComponent,
  imageComponentWrapper,
  layerOnTOp,
  container,
  dots,
  dotsWrapper,
} from "./dom.js";
import { colors, contrastColors } from "./constants.js";

function addAnimation() {
  layerOnTOp.addEventListener("mouseover", () => {
    imageComponentWrapper.forEach((img) => {
      anime({
        targets: img,
        scaleX: 0.95, // Scale down to 50% of its original width
        scaleY: 0.95, // Scale down to 50% of its original height
        duration: 200, // Animation duration in milliseconds
        easing: "easeOutQuad", // Easing function for the animation
      });
    });
    anime({
      targets: circle,
      scaleX: 0.9, // Scale down to 50% of its original width
      scaleY: 0.9, // Scale down to 50% of its original height
      duration: 200, // Animation duration in milliseconds
      easing: "easeOutQuad", // Easing function for the animation
    });
  });

  layerOnTOp.addEventListener("mouseout", () => {
    anime({
      targets: circle,
      scaleX: 1, // Scale down to 50% of its original width
      scaleY: 1, // Scale down to 50% of its original height
      duration: 200, // Animation duration in milliseconds
      easing: "easeOutQuad", // Easing function for the animation
    });
    imageComponentWrapper.forEach((img) => {
      anime({
        targets: img,
        scaleX: 1, // Scale down to 50% of its original width
        scaleY: 1, // Scale down to 50% of its original height
        duration: 200, // Animation duration in milliseconds
        easing: "easeOutQuad", // Easing function for the animation
      });
    });
  });
}

function findSlideIndex() {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const activeSlide = slides.findIndex((slide) =>
    slide.classList.contains("active")
  );

  return { activeSlide, slides };
}

function changeSlide(point, slideIndex) {
  const { activeSlide, slides } = findSlideIndex();

  // Get the next slide in the sequence.

  const nextSlide =
    activeSlide === slides.length - 1 ? 0 : (activeSlide + 1) % slides.length;

  const prevSlide =
    activeSlide === 0 ? slides.length - 1 : (activeSlide - 1) % slides.length;

  anime(exitAnimation(activeSlide)).finished.then(() => {
    // Remove active class from all slides
    slides.forEach((slide) => {
      slide.classList.remove("active");
    });
    if (point) {
      point === "next"
        ? slides[nextSlide].classList.add("active")
        : slides[prevSlide].classList.add("active");

      anime(slideAnimation());
      changeBackgroundColor();
      changeDotColors();
      changeBarColor();
      changeDotsBorderColor();
    } else if (slideIndex) {
      slides[slideIndex].classList.add("active");
      anime(slideAnimation());
      changeDotsBorderColor();
      changeBackgroundColor();
      changeDotColors();
      changeBarColor();
    }
  });
}

function addTimer(time) {
  const timer = setInterval(() => {
    changeSlide("next", null);
  }, time);

  return timer;
}

function slideAnimation() {
  const animation = {
    targets: ".slide.active",
    opacity: 1,
    scale: 1,
    duration: 400,
    easing: "easeInQuad",
  };

  return animation;
}

function exitAnimation() {
  const animation = {
    targets: ".slide.active",
    opacity: 0.6, // Animate opacity from 1 to 0
    scale: 0.7, // Animate scale down
    duration: 400,
    easing: "easeOutQuad",
  };

  return animation;
}

function findIndexColor(index, list) {
  return list[index];
}

function changeBackgroundColor() {
  const { activeSlide: index } = findSlideIndex();
  const currentColor = findIndexColor(index, contrastColors);

  anime({
    targets: container,
    backgroundColor: currentColor,
    duration: 200,
    easing: "easeOutInQuad",
  });
}

function changeDotColors() {
  const { activeSlide: index } = findSlideIndex();
  const currentColor = findIndexColor(index, colors);

  dotsWrapper.forEach((wrapper, index) => {
    let borderInAnimation, dotInAnimation;
    wrapper.addEventListener("mouseover", () => {
      borderInAnimation = anime({
        targets: wrapper,
        borderWidth: "5px",
        borderColor: currentColor,
        duration: 100,
        easing: "easeInQuad",
      });
      dotInAnimation = anime({
        targets: dots[index],
        scale: 0,
        duration: 100,
        easing: "easeInQuad",
      });
    });
    wrapper.addEventListener("mouseout", () => {
      borderInAnimation.remove(wrapper);
      dotInAnimation.remove(dots[index]);
      anime({
        targets: wrapper,
        borderColor: currentColor,
        borderWidth: "0px",
        duration: 100,
        easing: "easeOutQuad",
      });
      anime({
        targets: dots[index],
        scale: 1,
        duration: 100,
        easing: "easeOutQuad",
      });
    });
  });

  dots.forEach((dot) => {
    anime({
      targets: dot,
      backgroundColor: currentColor,
      duration: 500,
      easing: "easeOutQuad",
    });
  });
}

function changeDotsBorderColor() {
  const { activeSlide: index } = findSlideIndex();
  const currentColor = findIndexColor(index, colors);
  dotsWrapper.forEach((wrapper) => {
    anime({
      targets: wrapper,
      borderColor: currentColor,
      duration: 500,
      easing: "easeOutQuad",
    });
  });
}

function changeTheDotBorderSize() {
  dots.forEach((dot, index) => {
    dot.addEventListener("mouseover", () => {
      dot.style.outline = "4px solid black";
    });
    dot.addEventListener("mouseout", () => {
      dot.style.outline = "none";
    });
  });
}

function makeDotsSliderButton(interval) {
  dotsWrapper.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      const { activeSlide } = findSlideIndex();
      console.log(activeSlide === index);
      if (activeSlide !== index) {
        changeSlide(null, index);
        changeDotColors();
        changeBackgroundColor();
        clearInterval(interval);
        interval = addTimer(3000);
      }
    });
  });
}

function changeBarColor() {
  const { activeSlide: index } = findSlideIndex();
  const currentColor = findIndexColor(index, colors);
  bar.setAttribute("stroke", currentColor);
}

function init() {
  let timerInterval = addTimer(3000);
  changeBackgroundColor();
  changeBarColor();
  changeDotsBorderColor();
  changeDotColors();
  makeDotsSliderButton(timerInterval);
  addAnimation();
}

export { changeSlide, addTimer, addAnimation, makeDotsSliderButton, init };

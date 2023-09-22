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
      // anime(exitAnimation());
      // Add the `active` class to the next or prev slide.

      point === "next"
        ? slides[nextSlide].classList.add("active")
        : slides[prevSlide].classList.add("active");
      // Remove the `active` class from all other slides.
      anime(slideAnimation(slideIndex));
      changeBackgroundColor();
      changeDotColors();
      changeBarColor();
    } else if (slideIndex) {
      // anime(exitAnimation());

      slides[slideIndex].classList.add("active");
      anime(slideAnimation(slideIndex));
      // Remove the `active` class from all other slides.
      // slides
      //   .filter((slide, index) => index !== slideIndex)
      //   .forEach((slide) => {
      //     slide.classList.remove("active");
      //   });
      changeBackgroundColor();
      changeDotColors();
      changeBarColor();
    }
  });
}

function scaleSlide(slide) {
  // Create an animejs animation object.
  const animation = anime({
    targets: slide,
    scaleX: 0.9,
    scaleY: 0.9,
    duration: 500,
    easing: "easeInOutSine",
  });

  // Play the animation.
  animation.play();

  // Wait for the animation to finish.
  animation.finished.then(() => {
    // Create an animejs animation object.
    const animation = anime({
      targets: slide,
      scaleX: 1,
      scaleY: 1,
      duration: 500,
      easing: "easeInOutSine",
    });

    // Play the animation.
    animation.play();
  });
}

function addTimer(time) {
  const timer = setInterval(() => {
    changeSlide("next");
  }, time);

  return timer;
}

function slideAnimation(target) {
  const animation = {
    targets: ".slide.active",
    opacity: 1, // Animate opacity from 0 to 1
    scale: 1,
    duration: 400,
    easing: "easeInQuad",
  };

  return animation;
}

function exitAnimation(target) {
  const animation = {
    targets: ".slide.active",
    opacity: 0, // Animate opacity from 1 to 0
    scale: 0.6, // Animate scale down
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

  dotsWrapper.forEach((wrapper) => {
    wrapper.addEventListener("mouseover", () => {
      anime({
        targets: wrapper,
        borderColor: currentColor,
        borderWidth: "5px",
        duration: 100,
        easing: "easeOutQuad",
      });
    });
    wrapper.addEventListener("mouseout", () => {
      anime({
        targets: wrapper,
        borderColor: currentColor,
        borderWidth: "0px",
        duration: 100,
        easing: "easeOutQuad",
      });
    });
  });

  dots.forEach((dot) => {
    // dot.addEventListener("mouseover", () => {
    //   anime({
    //     targets: dot,
    //     backgroundColor: "rgba(0, 0, 0, 0)", // Transparent background color on hover
    //     borderColor: "#000", // Border color on hover
    //     borderWidth: "5px", // Border width on hover
    //     duration: 100,
    //     easing: "easeOutQuad",
    //   });
    // });
    // dot.addEventListener("mouseout", () => {
    //   anime({
    //     targets: dot,
    //     backgroundColor: currentColor,
    //     duration: 300,
    //     easing: "easeOutQuad",
    //   });
    // });

    anime({
      targets: dot,
      backgroundColor: currentColor,
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
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      changeSlide(null, index);
      changeDotColors();
      changeBackgroundColor();
      clearInterval(interval);
      interval = addTimer(2000);
    });
  });
}

function changeBarColor() {
  const { activeSlide: index } = findSlideIndex();
  const currentColor = findIndexColor(index, colors);
  bar.setAttribute("stroke", currentColor);
}

changeBarColor();
export { changeSlide, addTimer, addAnimation, makeDotsSliderButton };

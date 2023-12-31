import anime from "../node_modules/animejs/lib/anime.es.js";

import {
  bar,
  circle,
  imageComponentWrapper,
  layerOnTOp,
  container,
  dots,
  dotsWrapper,
  texts,
  bigCircle,
  thumbContainer,
  thumb,
} from "./dom.js";
import {
  colors,
  contrastColors,
  dynamicCircleValuesDesktop,
  dynamicCircleValuesMobile,
} from "./constants.js";

function addAnimation() {
  imageComponentWrapper.forEach((img, index) => {
    if (index === 0) {
      anime(imageAnimation(img).inAnimation);
    } else {
      anime(imageAnimation(img).outAnimation);
    }
  });

  texts.forEach((text, index) => {
    if (index === 0) {
      anime(textAnimation(text).inAnimation);
    } else {
      anime(textAnimation(text).outAnimation);
    }
  });
  layerOnTOp.addEventListener("mouseover", () => {
    imageComponentWrapper.forEach((img) => {
      anime({
        targets: img,
        scaleX: 0.95, // Scale down to 0.95% of its original width
        scaleY: 0.95, // Scale down to 0.95% of its original height
        duration: 200, // Animation duration in milliseconds
        easing: "easeOutQuad", // Easing function for the animation
      });
    });
    anime({
      targets: bigCircle,
      scaleX: 0.9, // Scale down to 0.9% of its original width
      scaleY: 0.9, // Scale down to 0.9% of its original height
      duration: 200, // Animation duration in milliseconds
      easing: "easeOutQuad", // Easing function for the animation
    });
  });

  layerOnTOp.addEventListener("mouseout", () => {
    anime({
      targets: bigCircle,
      scaleX: 1, // Scale down to 100% of its original width
      scaleY: 1, // Scale down to 100% of its original height
      duration: 200, // Animation duration in milliseconds
      easing: "easeOutQuad", // Easing function for the animation
    });
    imageComponentWrapper.forEach((img) => {
      anime({
        targets: img,
        scaleX: 1, // Scale down to 100% of its original width
        scaleY: 1, // Scale down to 100% of its original height
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

  // Out animations
  const exitAnimationPromise1 = anime(circleAnimation().outAnimation).finished;
  const exitAnimationPromise2 = anime(imageAnimation().outAnimation).finished;
  const exitAnimationPromise3 = anime(textAnimation().outAnimation).finished;

  // Get the next slide in the sequence.

  const nextSlide =
    activeSlide === slides.length - 1 ? 0 : (activeSlide + 1) % slides.length;

  const prevSlide =
    activeSlide === 0 ? slides.length - 1 : (activeSlide - 1) % slides.length;

  Promise.all([
    exitAnimationPromise1,
    exitAnimationPromise2,
    exitAnimationPromise3,
  ]).then(() => {
    // Remove active class from all slides
    slides.forEach((slide) => {
      slide.classList.remove("active");
    });
    if (point) {
      point === "next"
        ? slides[nextSlide].classList.add("active")
        : slides[prevSlide].classList.add("active");

      anime(circleAnimation().inAnimation);
      anime(imageAnimation().inAnimation);
      anime(textAnimation().inAnimation);
      changeBackgroundColor();
      changeDotColors();
      changeBarColor();
      changeDotsBorderColor();
      changeCircleColor();
      addBorderToActiveDots();
      dynamicCircle(
        nextSlide,
        dynamicCircleValuesDesktop,
        dynamicCircleValuesMobile
      );
    } else if (slideIndex || slideIndex === 0) {
      slides[slideIndex].classList.add("active");
      anime(circleAnimation().inAnimation);
      anime(imageAnimation().inAnimation);
      anime(textAnimation().inAnimation);
      dynamicCircle(
        slideIndex,
        dynamicCircleValuesDesktop,
        dynamicCircleValuesMobile
      );
      changeDotsBorderColor();
      changeBackgroundColor();
      changeDotColors();
      changeBarColor();
      changeCircleColor();
      addBorderToActiveDots();
    }
  });
}

function addTimer(time) {
  const timer = setInterval(() => {
    changeSlide("next", null);
  }, time);

  return timer;
}

function circleAnimation() {
  const inAnimation = {
    targets: circle,

    scale: 1,
    duration: 400,
    easing: "easeInQuad",
  };
  const outAnimation = {
    targets: circle,

    scale: 0.8,
    duration: 400,
    easing: "easeOutQuad",
  };
  return { inAnimation, outAnimation };
}

function textAnimation(target) {
  const inAnimation = {
    targets: target ? target : ".active .text",
    opacity: 1,
    duration: 400,
    easing: "easeInQuad",
  };
  const outAnimation = {
    targets: target ? target : ".active .text",
    opacity: 0,
    duration: 400,
    easing: "easeOutQuad",
  };
  return { inAnimation, outAnimation };
}

function imageAnimation(target) {
  const inAnimation = {
    targets: target ? target : ".active .slide__imgwrapper",
    opacity: 1,
    scale: 1,
    duration: 400,
    easing: "easeInQuad",
  };
  const outAnimation = {
    targets: target ? target : ".active .slide__imgwrapper",
    opacity: 0,
    scale: 0.6,
    duration: 400,
    easing: "easeOutQuad",
  };
  return { inAnimation, outAnimation };
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

function addBorderToActiveDots() {
  const { activeSlide: index } = findSlideIndex();
  const currentColor = findIndexColor(index, colors);

  dotsWrapper.forEach((wrapper, index2) => {
    if (index === index2) {
      anime({
        targets: wrapper,
        borderWidth: "5px",
        borderColor: currentColor,
        duration: 100,
        easing: "easeInQuad",
      });
      anime({
        targets: dots[index],
        scale: 0,
        duration: 100,
        easing: "easeInQuad",
      });
    } else {
      anime({
        targets: wrapper,
        borderColor: currentColor,
        borderWidth: "0px",
        duration: 100,
        easing: "easeOutQuad",
      });
      anime({
        targets: Array.from(dots).filter((node, index) => index === index2),
        scale: 1,
        duration: 100,
        easing: "easeOutQuad",
      });
    }
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

function makeDotsSliderButton(interval) {
  dotsWrapper.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      const { activeSlide } = findSlideIndex();

      if (activeSlide !== index) {
        changeSlide(null, index);
        changeDotColors();
        changeBackgroundColor();
        clearInterval(interval);

        // interval = addTimer(6000);
      }
    });
  });
}

function changeBarColor() {
  const { activeSlide: index } = findSlideIndex();
  const currentColor = findIndexColor(index, colors);
  bar.setAttribute("stroke", currentColor);
}

function animateCircle(circle) {
  const radiusList = [
    "120% 130% 125% 110%/130% 135% 110% 120%",
    "110% 120% 115% 105%/120% 125% 105% 115%",
    "125% 175% 160% 195%/155% 170% 185% 125%",
    "115% 125% 120% 110%/125% 130% 110% 120%",
    "130% 160% 125% 165%/140% 145% 115% 130%",
  ];

  anime({
    targets: circle,
    borderRadius: radiusList,
    easing: "easeInOutQuad",
    duration: 4000,
    keyframes: [
      { borderRadius: radiusList[0] },
      { borderRadius: radiusList[1] },
      { borderRadius: radiusList[2] },
      { borderRadius: radiusList[3] },
      { borderRadius: radiusList[4] },
    ],
    direction: "alternate",
    loop: true,
  });
}

function dynamicCircle(index, desktopValues, mobileValues) {
  const { activeSlide: index2 } = findSlideIndex();
  const currentColor = findIndexColor(index2, colors);
  let isMobile = window.innerWidth < 780;

  if (isMobile) {
    anime({
      targets: thumbContainer,
      duration: 3000,
      translateX: `${mobileValues[index2].left}%`,
      easing: "easeInOutCubic",
    });
  } else {
    anime({
      targets: thumbContainer,
      height: desktopValues[index].height,
      duration: 3000,
      rotate: desktopValues[index].rotate,
      easing: "easeInOutCubic",
    });
  }
  anime({
    targets: thumb,
    borderColor: currentColor,
    duration: 200,
    rotate: mobileValues[index].rotate,
    easing: "easeOutInQuad",
  });
}

function changeCircleColor() {
  const { activeSlide: index } = findSlideIndex();
  const currentColor = findIndexColor(index, colors);

  anime({
    targets: circle,
    backgroundColor: currentColor,
    duration: 200,
    easing: "easeOutInQuad",
  });
}

function init() {
  let timerInterval = addTimer(6000);
  changeBackgroundColor();
  changeBarColor();
  changeDotsBorderColor();
  changeCircleColor();
  changeDotColors();
  makeDotsSliderButton(timerInterval);
  addAnimation();
  animateCircle(circle);
  dynamicCircle(0, dynamicCircleValuesDesktop, dynamicCircleValuesMobile);
  animateCircle(thumb);
  addBorderToActiveDots();
}

export { changeSlide, addTimer, addAnimation, makeDotsSliderButton, init };

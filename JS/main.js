import {
  changeSlide,
  addTimer,
  addAnimation,
  makeDotsSliderButton,
} from "./utils.js";

let timerInterval = addTimer(3000);
addAnimation();
makeDotsSliderButton(timerInterval);

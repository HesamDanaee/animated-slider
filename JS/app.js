/**
 * Abstract Slider
 * @class
 */

class Slider {
  constructor(containerClass, slidesData) {
    this.container = document.querySelector(`.${containerClass}`);
    this.slidesData = !Array.isArray(slidesData) ? [slidesData] : slidesData;
    this.activeSlide = 0;
    this.init();
  }

  #createSVG = (path) => {
    const svg = document.createElement("object");
    svg.data = path;
    svg.type = "image/svg+xml";

    return svg;
  };

  #createSlide = ({ text, circle, image }, index) => {
    const slide = document.createElement("div");
    slide.classList.add("slide");
    slide.setAttribute("id", `slide_${index}`);

    circle = this.#createSVG(circle);
    circle.classList.add("circle");
    circle.setAttribute("id", `circle_${index}`);
    slide.appendChild(circle);

    text = this.#createSVG(text);
    text.classList.add("text");
    text.setAttribute("id", `text_${index}`);
    slide.appendChild(text);

    const img = document.createElement("img");
    img.classList.add("slide__img");
    img.setAttribute("id", `slide__img__${index}`);
    img.src = image;
    img.alt = "Slide image";
    slide.appendChild(img);

    return slide;
  };

  init = () => {
    this.slidesData.forEach((slideData, index) => {
      const slide = this.#createSlide(slideData);
      this.container.appendChild(slide);
    });
  };
}

export { Slider };

/*
 Slider has different backgorund, font and photos. each photo of each slide has a different
 position.
 putting each image,bg and font on in the html files just mess the html file.
 you should 

1. create slider 
2. add circle to slider
3. add photos to slider
4. add fonts to slider
5. add class and ids  associated to each component 
6. add style for each component in css file
7. 






*/

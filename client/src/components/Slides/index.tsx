import React from "react";

import styles from "./Slides.module.scss";

type SlidesProps = {
  totalSlides: number;
  activeSlide: number;
  onChange: (slide: number) => void;
};

const Slides = ({ activeSlide, totalSlides, onChange }: SlidesProps) => {
  let handlePrevious = () => {
    if (activeSlide === 0) return;
    onChange(activeSlide - 1);
  };

  let handleNext = () => {
    if (activeSlide === totalSlides - 1) return;
    onChange(activeSlide + 1);
  };

  return (
    <div className={styles.container}>
      <button disabled={activeSlide === 0} onClick={handlePrevious}>
        <i className="bx-chevron-left"></i>
      </button>
      <div className={styles.slide}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="46"
          height="36"
          viewBox="0 0 46 36"
        >
          <g fill="none">
            <rect
              width="38"
              height="22"
              x="1"
              y="7"
              stroke="#3C4043"
              strokeWidth="2"
            ></rect>
            <path
              fill="#5F6368"
              d="M8,4 L6,4 L6,0 L46,0 L46,24 L42,24 L42,22 L44,22 L44,2 L8,2 L8,4 Z"
            ></path>
            <polygon fill="#80868B" points="26 33 23 36 20 33"></polygon>
          </g>
        </svg>
        <span>
          {activeSlide + 1} / {totalSlides}
        </span>
      </div>
      <button disabled={activeSlide === totalSlides - 1} onClick={handleNext}>
        <i className="bx-chevron-right"></i>
      </button>
    </div>
  );
};

export default Slides;

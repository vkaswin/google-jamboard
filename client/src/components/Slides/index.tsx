import { Fragment } from "react";
import Shapes from "@/components/Shapes";
import { SlideDetail } from "@/types/Document";

import styles from "./Slides.module.scss";
import DropDown from "../DropDown";

type SlidesProps = {
  slides: SlideDetail[];
  activeSlide: number;
  activeSlideId?: string;
  onSlideChange: (slide: number) => void;
  onAddSlide: () => void;
  onDeleteSlide: (slideId: string) => void;
};

const Slides = ({
  slides,
  activeSlide,
  activeSlideId,
  onSlideChange,
  onAddSlide,
  onDeleteSlide,
}: SlidesProps) => {
  let totalSlides = slides ? slides.length : 1;

  let handlePrevious = () => {
    if (activeSlide === 1) return;
    onSlideChange(activeSlide - 1);
  };

  let handleNext = () => {
    if (activeSlide === totalSlides - 1) return;
    onSlideChange(activeSlide + 1);
  };

  console.log(slides);

  return (
    <Fragment>
      <div className={styles.container}>
        <button
          className={styles.navigate_btn}
          disabled={activeSlide === 1}
          onClick={handlePrevious}
        >
          <i className="bx-chevron-left"></i>
        </button>
        <div className={styles.slide_icon}>
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
            {activeSlide} / {totalSlides}
          </span>
        </div>
        <button
          className={styles.navigate_btn}
          disabled={activeSlide === totalSlides - 1}
          onClick={handleNext}
        >
          <i className="bx-chevron-right"></i>
        </button>
      </div>
      <div className={styles.slides}>
        <button
          className={styles.navigate_btn}
          disabled={activeSlide === 1}
          onClick={handlePrevious}
        >
          <i className="bx-chevron-left"></i>
        </button>
        <div className={styles.slide_list}>
          {slides &&
            slides.length > 0 &&
            slides.map((slide) => {
              return (
                <Fragment key={slide._id}>
                  <div
                    className={`${styles.slide} ${
                      slide._id === activeSlideId ? styles.active : undefined
                    }`}
                  >
                    <div className={styles.board}>
                      {slide.shapes &&
                        slide.shapes.map((shape) => {
                          return <Shapes key={shape._id} shape={shape} />;
                        })}
                    </div>
                    <button id={`slide-dropdown-${slide._id}`}>
                      <i className="bx-dots-vertical-rounded"></i>
                    </button>
                  </div>
                  <DropDown
                    selector={`#slide-dropdown-${slide._id}`}
                    className={styles.slide_dropdown}
                    placement="bottom"
                  >
                    <DropDown.Item>
                      <i className="bx-duplicate"></i>
                      <span>Duplicate</span>
                    </DropDown.Item>
                    <DropDown.Item onClick={() => onDeleteSlide(slide._id)}>
                      <i className="bx-trash"></i>
                      <span>Delete</span>
                    </DropDown.Item>
                  </DropDown>
                </Fragment>
              );
            })}
          <button className={styles.add_btn} onClick={onAddSlide}>
            <i className="bx-plus"></i>
          </button>
        </div>
        <button
          className={styles.navigate_btn}
          disabled={activeSlide === totalSlides - 1}
          onClick={handleNext}
        >
          <i className="bx-chevron-right"></i>
        </button>
      </div>
    </Fragment>
  );
};

export default Slides;

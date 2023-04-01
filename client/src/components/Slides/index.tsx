import { Fragment, useEffect, useRef, useState } from "react";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide, SwiperProps } from "swiper/react";
import { InactiveShapes } from "@/components/Shapes";
import DropDown from "@/components/DropDown";
import { getStaticUrl } from "@/utils";
import { SlideDetail } from "@/types/Document";

import "swiper/scss";
import styles from "./Slides.module.scss";

type SlidesProps = {
  slides: SlideDetail[];
  activeSlide: number;
  activeSlideId?: string;
  dimension: { width: number; height: number };
  onSlideChange: (slide: number) => void;
  onAddSlide: (position: number) => void;
  onDeleteSlide: (slideId: string) => void;
};

// aspect ratio 16 / 9
let slideDimension = {
  width: 224,
  height: 126,
};

const swiperOptions: SwiperProps = {
  slidesPerView: "auto",
  spaceBetween: 10,
  initialSlide: 0,
  modules: [Navigation],
  navigation: {
    nextEl: "#slide_next",
    prevEl: "#slide_prev",
  },
  style: { padding: "25px 0px" },
};

const Slides = ({
  slides,
  activeSlide,
  activeSlideId,
  dimension,
  onSlideChange,
  onAddSlide,
  onDeleteSlide,
}: SlidesProps) => {
  let [isOpen, setIsOpen] = useState(false);

  let containerRef = useRef<HTMLDivElement | null>(null);

  let totalSlides = slides ? slides.length : 1;

  let canvasDimension = {
    width: dimension.width / 2,
    height: dimension.height / 2,
  };

  useEffect(() => {
    if (!containerRef.current) return;
    setTimeout(() => {
      isOpen
        ? window.addEventListener("click", handleSlidePopup)
        : window.removeEventListener("click", handleSlidePopup);
    }, 0);

    return () => {
      window.removeEventListener("click", handleSlidePopup);
    };
  }, [isOpen]);

  let handleSlidePopup = (event: MouseEvent) => {
    if (!containerRef.current) return;
    let el = event.target as HTMLElement;
    if (containerRef.current.contains(el)) return;
    toggle();
  };

  let toggle = () => {
    setIsOpen(!isOpen);
  };

  let handlePrevious = () => {
    if (activeSlide === 0) return;
    onSlideChange(activeSlide - 1);
  };

  let handleNext = () => {
    if (activeSlide === totalSlides - 1) return;
    onSlideChange(activeSlide + 1);
  };

  return (
    <Fragment>
      <div className={styles.container}>
        <button
          className={styles.navigate_btn}
          disabled={activeSlide === 0}
          onClick={handlePrevious}
        >
          <i className="bx-chevron-left"></i>
        </button>
        <div className={styles.slide_icon} onClick={toggle}>
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
        <button
          className={styles.navigate_btn}
          disabled={activeSlide === totalSlides - 1}
          onClick={handleNext}
        >
          <i className="bx-chevron-right"></i>
        </button>
      </div>
      <div ref={containerRef} className={styles.slides} aria-expanded={isOpen}>
        <button
          id="slide_prev"
          className={styles.navigate_btn}
          onClick={handlePrevious}
        >
          <i className="bx-chevron-left"></i>
        </button>
        <div className={styles.slide_list}>
          <Swiper {...swiperOptions}>
            {slides &&
              slides.length > 0 &&
              slides.map((slide, index) => {
                return (
                  <SwiperSlide key={slide._id} className={styles.swiper_slide}>
                    <div
                      className={`${styles.slide} ${
                        slide._id === activeSlideId ? styles.active : ""
                      }`.trim()}
                      style={{
                        width: `${slideDimension.width + 4}px`,
                        height: `${slideDimension.height + 4}px`,
                      }}
                      data-mini-slide={slide._id}
                      onClick={() => onSlideChange(index)}
                    >
                      <div
                        className={styles.board}
                        style={{
                          width: `${dimension.width}px`,
                          height: `${dimension.height}px`,
                          transform: `scale(${
                            slideDimension.width / dimension.width
                          },${slideDimension.height / dimension.height})`,
                          backgroundImage: `url(${getStaticUrl(
                            `/background/${slide.props.backgroundImage}`
                          )}.png)`,
                        }}
                      >
                        <canvas
                          width={canvasDimension.width}
                          height={canvasDimension.height}
                          mini-canvas={slide.canvas._id}
                        />
                        {slide.shapes &&
                          slide.shapes.map((shape) => {
                            return (
                              <InactiveShapes key={shape._id} shape={shape} />
                            );
                          })}
                      </div>
                      <button
                        id={`slide-dropdown-${slide._id}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <i className="bx-dots-vertical-rounded"></i>
                      </button>
                    </div>
                    <button
                      className={styles.add_btn}
                      onClick={() => onAddSlide(index + 1)}
                    >
                      <i className="bx-plus"></i>
                    </button>
                    <DropDown
                      selector={`#slide-dropdown-${slide._id}`}
                      className={styles.slide_dropdown}
                      placement="bottom"
                    >
                      <DropDown.Item onClick={() => onDeleteSlide(slide._id)}>
                        <i className="bx-trash"></i>
                        <span>Delete</span>
                      </DropDown.Item>
                    </DropDown>
                  </SwiperSlide>
                );
              })}
          </Swiper>
        </div>
        <button
          id="slide_next"
          className={styles.navigate_btn}
          onClick={handleNext}
        >
          <i className="bx-chevron-right"></i>
        </button>
      </div>
    </Fragment>
  );
};

export default Slides;

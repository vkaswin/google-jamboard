import React, { useLayoutEffect, useRef, useState } from "react";
import { getStaticUrl } from "@/utils";
import { ShapeDetail } from "@/types/Document";

import styles from "./Resizer.module.scss";

type ResizerProps = { shape: ShapeDetail };

const Resizer = ({ shape }: ResizerProps) => {
  let [property, setProperty] = useState(shape.props);

  let { width, height, translateX, translateY, rotate } = property;

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.style.width = `${width + 30}px`;
    containerRef.current.style.height = `${height + 30}px`;
    containerRef.current.style.transform = `translateX(${translateX}px) translateY(${translateY}px) rotate(${rotate}deg)`;
  }, []);

  let containerRef = useRef<HTMLDivElement | null>(null);

  let handleMouseMove = (event: MouseEvent) => {
    console.log(event);
  };

  let handleMouseUp = () => {
    window.removeEventListener("mousemove", handleMouseMove);
  };

  let handleMouseDown = (event: React.MouseEvent) => {
    console.log(event);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp, { once: true });
  };

  return (
    <div ref={containerRef} className={styles.container}>
      <button className={styles.top_left} onMouseDown={handleMouseDown}>
        <img src={getStaticUrl("/rotate.svg")} alt="" draggable={false} />
      </button>
      <button
        className={styles.top_center}
        onMouseDown={handleMouseDown}
      ></button>
      <button shape-id={shape._id} className={styles.top_right}>
        <i className="bx-dots-vertical-rounded"></i>
      </button>
      <button className={styles.left} onMouseDown={handleMouseDown}></button>
      <button className={styles.right} onMouseDown={handleMouseDown}></button>
      <button
        className={styles.bottom_left}
        onMouseDown={handleMouseDown}
      ></button>
      <button
        className={styles.bottom_center}
        onMouseDown={handleMouseDown}
      ></button>
      <button
        className={styles.bottom_right}
        onMouseDown={handleMouseDown}
      ></button>
    </div>
  );
};

export default Resizer;

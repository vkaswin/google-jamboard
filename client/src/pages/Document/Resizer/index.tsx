import React, { useEffect } from "react";
import { getStaticUrl } from "@/utils";

import styles from "./Resizer.module.scss";
import { createPortal } from "react-dom";

type ResizerProps = {
  shapeId: string | null;
};

const Resizer = ({ shapeId }: ResizerProps) => {
  useEffect(() => {
    if (!shapeId) return;
    console.log(shapeId);
  }, [shapeId]);

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

  return createPortal(
    <div className={styles.container}>
      <button className={styles.top_left} onMouseDown={handleMouseDown}>
        <img src={getStaticUrl("/rotate.svg")} alt="" draggable={false} />
      </button>
      <button
        className={styles.top_center}
        onMouseDown={handleMouseDown}
      ></button>
      <button shape-id={shapeId} className={styles.top_right}>
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
    </div>,
    document.body
  );
};

export default Resizer;

import React, { useEffect, useRef } from "react";
import { getStaticUrl } from "@/utils";
import { ShapeProps } from "@/types/Document";
import { Placement } from "@/types/Popper";

import styles from "./Resizer.module.scss";

type ResizerProps = {
  shapeId: string;
  property: ShapeProps;
  onChange: (props: ShapeProps) => void;
  onUpdateShape: (props: ShapeProps) => void;
};

type ResizeType = Placement | "rotate" | "move";

type MouseDownEvent = {
  type: ResizeType;
  pageX: number;
  pageY: number;
};

const Resizer = ({
  shapeId,
  property,
  onChange,
  onUpdateShape,
}: ResizerProps) => {
  let containerRef = useRef<HTMLElement | null>(null);

  let mouseDownEvent = useRef<MouseDownEvent | null>(null);

  let shapeProps = useRef<ShapeProps | null>(null);

  useEffect(() => {
    let element = document.querySelector("#whiteboard") as HTMLElement;
    containerRef.current = element;
  }, []);

  let handleMouseMove = ({ x, y }: MouseEvent) => {
    if (!mouseDownEvent.current || !containerRef.current) return;

    let { pageX, pageY, type } = mouseDownEvent.current;

    let props = {
      ...property,
    };

    let { width, height } = containerRef.current.getBoundingClientRect();
    let { clientWidth, clientHeight } = containerRef.current;

    let scaleX = clientWidth / width;
    let scaleY = clientHeight / height;

    switch (type) {
      case "move":
        props.translateX += (x - pageX) * scaleX;
        props.translateY += (y - pageY) * scaleY;
        break;

      case "rotate":
        break;

      case "left":
        props.translateX += (x - pageX) * scaleX;
        props.width +=
          x - pageX < 0 ? -(x - pageX) * scaleX : -(x - pageX) * scaleX;
        break;

      case "right":
        props.width += (x - pageX) * scaleX;
        break;

      case "bottom":
        props.height += (y - pageY) * scaleY;
        break;

      case "top":
        props.translateY += (y - pageY) * scaleY;
        props.height +=
          y - pageY < 0 ? -(y - pageY) * scaleY : -(y - pageY) * scaleY;
        break;

      case "bottom-start":
        props.translateX += (x - pageX) * scaleX;
        props.width +=
          x - pageX < 0 ? -(x - pageX) * scaleX : -(x - pageX) * scaleX;
        props.height += (y - pageY) * scaleY;
        break;

      case "bottom-end":
        props.width += (x - pageX) * scaleX;
        props.height += (y - pageY) * scaleY;
        break;

      default:
        return;
    }

    if (
      props.width <= 125 ||
      props.height <= 125 ||
      props.translateX <= 0 ||
      props.translateX >= clientWidth - property.width ||
      props.translateY <= 0 ||
      props.translateY >= clientHeight - property.height
    )
      return;

    shapeProps.current = props;
    onChange(props);
  };

  let handleMouseUp = () => {
    if (!shapeProps.current) return;
    onUpdateShape(shapeProps.current);
    shapeProps.current = null;
    mouseDownEvent.current = null;
    window.removeEventListener("mousemove", handleMouseMove);
  };

  let handleMouseDown = (event: React.MouseEvent, type: ResizeType) => {
    event.stopPropagation();
    let { pageX, pageY } = event;
    mouseDownEvent.current = {
      type,
      pageX,
      pageY,
    };
    window.addEventListener("mouseup", handleMouseUp, { once: true });
    window.addEventListener("mousemove", handleMouseMove);
  };

  let { width, height, translateX, translateY, rotate } = property;

  return (
    <div
      className={styles.container}
      onMouseDown={(e) => handleMouseDown(e, "move")}
      style={{
        width: `${width + 30}px`,
        height: `${height + 30}px`,
        transform: `translate(${translateX}px, ${translateY}px) scale(1) rotate(${rotate}deg)`,
      }}
    >
      <button
        className={styles.top_start}
        onMouseDown={(e) => handleMouseDown(e, "rotate")}
      >
        <img src={getStaticUrl("/rotate.svg")} alt="" draggable={false} />
      </button>
      <button
        className={styles.top}
        onMouseDown={(e) => handleMouseDown(e, "top")}
      ></button>
      <button
        shape-id={shapeId}
        className={styles.top_end}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <i className="bx-dots-vertical-rounded"></i>
      </button>
      <button
        className={styles.left}
        onMouseDown={(e) => handleMouseDown(e, "left")}
      ></button>
      <button
        className={styles.right}
        onMouseDown={(e) => handleMouseDown(e, "right")}
      ></button>
      <button
        className={styles.bottom_start}
        onMouseDown={(e) => handleMouseDown(e, "bottom-start")}
      ></button>
      <button
        className={styles.bottom}
        onMouseDown={(e) => handleMouseDown(e, "bottom")}
      ></button>
      <button
        className={styles.bottom_end}
        onMouseDown={(e) => handleMouseDown(e, "bottom-end")}
      ></button>
    </div>
  );
};

export default Resizer;

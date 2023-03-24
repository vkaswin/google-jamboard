import React, { useEffect, useRef } from "react";
import { getStaticUrl } from "@/utils";
import { ShapeDetail, ShapeProps } from "@/types/Document";

import styles from "./Resizer.module.scss";

type ResizerProps = {
  shapeId: string;
  property: ShapeProps;
  onChange: (props: ShapeProps) => void;
  onUpdateShape: (props: ShapeProps) => void;
};

type ResizeType = "rotate" | "stretch-x" | "stretch-y" | "stretch-xy" | "move";

type MouseDownEvent = {
  type: ResizeType;
  rect: DOMRect;
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

    let { pageX, pageY, rect, type } = mouseDownEvent.current;

    let props = {
      ...property,
    };

    let { width, height } = containerRef.current.getBoundingClientRect();
    let { clientWidth, clientHeight } = containerRef.current;
    // console.log(x - pageX, y - pageY, rect);

    switch (type) {
      case "move":
        props.translateX += (x - pageX) * (clientWidth / width);
        props.translateY += (y - pageY) * (clientHeight / height);
        break;

      default:
        return;
    }

    if (
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

  let handleMouseDown = (
    { target, pageX, pageY }: React.MouseEvent,
    type: ResizeType
  ) => {
    mouseDownEvent.current = {
      type,
      rect: (target as HTMLElement).getBoundingClientRect(),
      pageX,
      pageY,
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp, { once: true });
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
        className={styles.top_left}
        onMouseDown={(e) => handleMouseDown(e, "rotate")}
      >
        <img src={getStaticUrl("/rotate.svg")} alt="" draggable={false} />
      </button>
      <button
        className={styles.top_center}
        onMouseDown={(e) => handleMouseDown(e, "stretch-y")}
      ></button>
      <button
        shape-id={shapeId}
        className={styles.top_right}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <i className="bx-dots-vertical-rounded"></i>
      </button>
      <button
        className={styles.left}
        onMouseDown={(e) => handleMouseDown(e, "stretch-xy")}
      ></button>
      <button
        className={styles.right}
        onMouseDown={(e) => handleMouseDown(e, "stretch-x")}
      ></button>
      <button
        className={styles.bottom_left}
        onMouseDown={(e) => handleMouseDown(e, "stretch-xy")}
      ></button>
      <button
        className={styles.bottom_center}
        onMouseDown={(e) => handleMouseDown(e, "stretch-y")}
      ></button>
      <button
        className={styles.bottom_right}
        onMouseDown={(e) => handleMouseDown(e, "stretch-xy")}
      ></button>
    </div>
  );
};

export default Resizer;

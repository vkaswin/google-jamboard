import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { getStaticUrl, clickOutside } from "@/utils";
import { ShapeProps, ShapeTypes } from "@/types/Document";
import { Placement } from "@/types/Popper";

import styles from "./Resizer.module.scss";

type ResizerProps = {
  shapeId: string;
  shapeType: ShapeTypes;
  property: ShapeProps;
  shapeRef: HTMLDivElement | null;
  onChange: (props: ShapeProps) => void;
  onClose?: () => void;
  resetEditText: () => void;
  onPropertyChange: (props: ShapeProps) => void;
};

type ResizeType = Placement | "rotate" | "move";

type MouseDownEvent = {
  type: ResizeType;
  pageX: number;
  pageY: number;
};

const Resizer = forwardRef(
  (
    {
      shapeId,
      property,
      shapeType,
      shapeRef,
      onChange,
      onClose,
      onPropertyChange,
      resetEditText,
    }: ResizerProps,
    ref
  ) => {
    let whiteBoard = useRef<HTMLElement | null>(null);

    let resizerRef = useRef<HTMLDivElement | null>(null);

    let mouseDownEvent = useRef<MouseDownEvent | null>(null);

    let shapeProps = useRef<ShapeProps | null>(null);

    useEffect(() => {
      let element = document.querySelector("#whiteboard") as HTMLElement;
      whiteBoard.current = element;

      if (!shapeRef) return;

      let unRegister = clickOutside({
        ref: shapeRef,
        onClose: onClose,
        doNotClose: (ele) => {
          if (!resizerRef.current || !shapeRef) return;
          return resizerRef.current.contains(ele) || shapeRef.contains(ele);
        },
      });

      return () => {
        unRegister();
        resetEditText();
      };
    }, []);

    let handleMouseMove = ({ x, y }: MouseEvent) => {
      if (!mouseDownEvent.current || !whiteBoard.current) return;

      let { pageX, pageY, type } = mouseDownEvent.current;

      let props = {
        ...property,
      };

      let { width, height } = whiteBoard.current.getBoundingClientRect();
      let { clientWidth, clientHeight } = whiteBoard.current;

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
          props.width += -(x - pageX) * scaleX;
          break;

        case "right":
          props.width += (x - pageX) * scaleX;
          break;

        case "bottom":
          props.height += (y - pageY) * scaleY;
          break;

        case "top":
          props.translateY += (y - pageY) * scaleY;
          props.height += -(y - pageY) * scaleY;
          break;

        case "bottom-start":
          props.translateX += (x - pageX) * scaleX;
          props.width += -(x - pageX) * scaleX;
          props.height += (y - pageY) * scaleY;
          break;

        case "bottom-end":
          props.width += (x - pageX) * scaleX;
          props.height += (y - pageY) * scaleY;
          break;

        default:
          return;
      }

      if (type === "move") {
        props.translateX = Math.max(
          0,
          Math.min(clientWidth - props.width, props.translateX)
        );
        props.translateY = Math.max(
          0,
          Math.min(clientHeight - props.height, props.translateY)
        );
      } else {
        props.width = Math.min(
          clientWidth - props.translateX,
          Math.max(125, props.width)
        );

        props.height = Math.min(
          clientHeight - props.translateY,
          Math.max(125, props.height)
        );
      }
      shapeProps.current = props;
      onChange(props);
    };

    let removeMouseListeners = () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };

    let addMouseListeners = () => {
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("mousemove", handleMouseMove);
    };

    let handleMouseUp = () => {
      if (!shapeProps.current) return;
      removeMouseListeners();
      onPropertyChange(shapeProps.current);
      shapeProps.current = null;
      mouseDownEvent.current = null;
    };

    let handleMouseDown = (event: React.MouseEvent, type: ResizeType) => {
      event.stopPropagation();
      let { pageX, pageY } = event;
      mouseDownEvent.current = {
        type,
        pageX,
        pageY,
      };
      addMouseListeners();
    };

    useImperativeHandle(
      ref,
      () => ({
        handleMouseDown,
        removeMouseListeners,
      }),
      []
    );

    let { width, height, translateX, translateY, rotate } = property;

    return (
      <div
        ref={resizerRef}
        className={styles.container}
        style={{
          width: `${width + 30}px`,
          height: `${height + 30}px`,
          transform: `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg)`,
        }}
      >
        <button
          className={styles.top_start}
          onMouseDown={(e) => handleMouseDown(e, "rotate")}
        >
          <img src={getStaticUrl("/rotate.svg")} alt="" draggable={false} />
        </button>
        {!(shapeType === "sticky-note" || shapeType === "text-box") && (
          <button
            className={styles.top}
            onMouseDown={(e) => handleMouseDown(e, "top")}
          ></button>
        )}
        <button shape-id={shapeId} className={styles.top_end}>
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
        {!(shapeType === "sticky-note" || shapeType === "text-box") && (
          <button
            className={styles.bottom}
            onMouseDown={(e) => handleMouseDown(e, "bottom")}
          ></button>
        )}
        <button
          className={styles.bottom_end}
          onMouseDown={(e) => handleMouseDown(e, "bottom-end")}
        ></button>
      </div>
    );
  }
);

export default Resizer;

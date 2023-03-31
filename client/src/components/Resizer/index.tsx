import { useEffect, useRef, MouseEvent } from "react";
import { getStaticUrl, clickOutside } from "@/utils";
import { ResizeType, ShapeProps } from "@/types/Document";

import styles from "./Resizer.module.scss";

type ResizerProps = {
  shapeId: string;
  shapeProps: ShapeProps;
  shapeRef: HTMLDivElement | null;
  onClose?: () => void;
  onReset: () => void;
  onMouseDown: (e: MouseEvent, type: ResizeType) => void;
};

const Resizer = ({
  shapeId,
  shapeProps,
  shapeRef,
  onClose,
  onMouseDown,
  onReset,
}: ResizerProps) => {
  let resizerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!shapeRef) return;

    let unRegister = clickOutside({
      ref: shapeRef,
      onClose: onClose,
      doNotClose: (ele) => {
        if (!resizerRef.current || !shapeRef) return;
        let colorDropDown = [
          ...document.querySelectorAll(
            "#border,#background,#border-dropdown,#background-dropdown"
          ),
        ];

        let isClickOnColorDropDown = colorDropDown.some((element) =>
          element.contains(ele)
        );
        return (
          resizerRef.current.contains(ele) ||
          shapeRef.contains(ele) ||
          isClickOnColorDropDown
        );
      },
    });

    return () => {
      unRegister();
      onReset();
    };
  }, []);
  let { width, height, translateX, translateY, rotate } = shapeProps;

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
        onMouseDown={(e) => onMouseDown(e, "rotate")}
      >
        <img src={getStaticUrl("/rotate.svg")} alt="" draggable={false} />
      </button>
      <button
        className={styles.top}
        onMouseDown={(e) => onMouseDown(e, "top")}
      ></button>
      <button shape-id={shapeId} className={styles.top_end}>
        <i className="bx-dots-vertical-rounded"></i>
      </button>
      <button
        className={styles.left}
        onMouseDown={(e) => onMouseDown(e, "left")}
      ></button>
      <button
        className={styles.right}
        onMouseDown={(e) => onMouseDown(e, "right")}
      ></button>
      <button
        className={styles.bottom_start}
        onMouseDown={(e) => onMouseDown(e, "bottom-start")}
      ></button>
      <button
        className={styles.bottom}
        onMouseDown={(e) => onMouseDown(e, "bottom")}
      ></button>
      <button
        className={styles.bottom_end}
        onMouseDown={(e) => onMouseDown(e, "bottom-end")}
      ></button>
    </div>
  );
};

export default Resizer;

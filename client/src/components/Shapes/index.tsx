import React, {
  Fragment,
  useMemo,
  useRef,
  useState,
  ChangeEvent,
  useEffect,
} from "react";
import Circle from "./Circle";
import Diamond from "./Diamond";
import Rectangle from "./Rectangle";
import Square from "./Square";
import Triangle from "./Triangle";
import Arrow from "./Arrow";
import StickyNote from "./StickyNote";
import TextBox from "./TextBox";
import Resizer from "../Resizer";
import { debounce } from "@/utils";
import {
  ShapeDetail,
  ShapeProps,
  ResizeType,
  MouseDownEvent,
  ShapeTypes,
} from "@/types/Document";

import styles from "./Shape.module.scss";

type ShapesPropsType = {
  shape: ShapeDetail;
  selectedShapeId: string | null;
  onUpdateShape: (shape: Omit<ShapeDetail, "type">) => void;
  onClick: (id: string) => void;
  onBlur: () => void;
  onEditStickyNote?: () => void;
  onDeleteShape: (shapeId: string) => void;
};

const Shapes = ({
  shape,
  selectedShapeId,
  onClick,
  onBlur,
  onUpdateShape,
  onDeleteShape,
  onEditStickyNote,
}: ShapesPropsType) => {
  let [shapeProps, setShapeProps] = useState<ShapeProps | null>(null);

  let [isReadOnly, setIsReadOnly] = useState(true);

  let [shapeRef, setShapeRef] = useState<HTMLDivElement | null>(null);

  let mouseDownEvent = useRef<MouseDownEvent | null>(null);

  let textChange = debounce<Omit<ShapeDetail, "type">>(
    (props) => onUpdateShape(props),
    1000
  );

  useEffect(() => {
    setShapeProps(shape.props);
  }, [shape.props]);

  let handleChangeText = ({
    target: { value, scrollHeight },
  }: ChangeEvent<HTMLTextAreaElement>) => {
    if (!shapeProps) return;
    let props = { ...shapeProps, height: scrollHeight, text: value };
    textChange({ _id: shape._id, props });
    setShapeProps(props);
  };

  let shapeComponent = useMemo(() => {
    if (!shapeProps) return null;

    let { width, height, borderColor, backgroundColor, text } = shapeProps;

    switch (shape.type) {
      case "sticky-note":
        return <StickyNote text={text} style={{ backgroundColor }} />;

      case "text-box":
        return (
          <TextBox
            defaultValue={text}
            readOnly={isReadOnly}
            onChange={handleChangeText}
          />
        );

      case "arrow":
        return (
          <Arrow
            width={width}
            height={height}
            borderColor={borderColor}
            backgroundColor={backgroundColor}
          />
        );

      case "circle":
        return (
          <Circle
            width={width}
            height={height}
            borderColor={borderColor}
            backgroundColor={backgroundColor}
          />
        );

      case "diamond":
        return (
          <Diamond
            width={width}
            height={height}
            borderColor={borderColor}
            backgroundColor={backgroundColor}
          />
        );

      case "rectangle":
        return (
          <Rectangle
            width={width}
            height={height}
            borderColor={borderColor}
            backgroundColor={backgroundColor}
          />
        );

      case "square":
        return (
          <Square
            width={width}
            height={height}
            borderColor={borderColor}
            backgroundColor={backgroundColor}
          />
        );

      case "triangle":
        return (
          <Triangle
            width={width}
            height={height}
            borderColor={borderColor}
            backgroundColor={backgroundColor}
          />
        );

      default:
        return null;
    }
  }, [
    shape.type,
    shapeProps?.width,
    shapeProps?.height,
    shapeProps?.backgroundColor,
    shapeProps?.borderColor,
    shapeProps?.color,
    shapeProps?.text,
    isReadOnly,
  ]);

  let findAngle = ({
    cx,
    cy,
    ex,
    ey,
  }: {
    cx: number;
    cy: number;
    ex: number;
    ey: number;
  }) => {
    let dy = ey - cy;
    let dx = ex - cx;
    let rad = Math.atan2(dy, dx);
    let deg = (rad * 180) / Math.PI;
    return deg;
  };

  let handleMouseMove = ({ x, y }: MouseEvent) => {
    if (!shapeProps || !mouseDownEvent.current || !shapeRef) return;

    let { pageX, pageY, type } = mouseDownEvent.current;

    let props = {
      ...shapeProps,
    };

    let { width, height } = shapeRef.parentElement!.getBoundingClientRect();
    let { clientWidth, clientHeight } = shapeRef.parentElement!;

    let scaleX = clientWidth / width;
    let scaleY = clientHeight / height;

    switch (type) {
      case "move":
        props.translateX += (x - pageX) * scaleX;
        props.translateY += (y - pageY) * scaleY;
        break;

      case "rotate":
        let { left, top, width, height } = shapeRef.getBoundingClientRect();
        let shapeX = left + width / 2;
        let shapeY = top + height / 2;
        props.rotate = 90 + findAngle({ cx: x, cy: y, ex: shapeX, ey: shapeY });
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

    setShapeProps(props);
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
    removeMouseListeners();
    mouseDownEvent.current = null;

    setShapeProps((props) => {
      if (props) onUpdateShape({ _id: shape._id, props });
      return props;
    });
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

  let handleDoubleClick = () => {
    if (!(shape.type === "sticky-note" || shape.type === "text-box")) return;
    setIsReadOnly(false);
  };

  let handleClickShape = () => {
    onClick(shape._id);
  };

  let resetEditText = () => {
    if (!isReadOnly) setIsReadOnly(true);
  };

  if (!shapeProps) return null;

  return (
    <Fragment>
      <div
        ref={setShapeRef}
        className={styles.container}
        onClick={handleClickShape}
        style={{
          width: `${shapeProps.width}px`,
          height: `${shapeProps.height}px`,
          transform: `translate(${shapeProps.translateX}px, ${shapeProps.translateY}px) rotate( ${shapeProps.rotate}deg)`,
        }}
      >
        {shapeComponent}
        {shape._id === selectedShapeId && (
          <div
            className={styles.overlay}
            onDoubleClick={handleDoubleClick}
            onMouseDown={(e) => handleMouseDown(e, "move")}
            style={{
              cursor: isReadOnly ? "move" : "default",
              pointerEvents: isReadOnly ? "auto" : "none",
            }}
          ></div>
        )}
      </div>
      {shape._id === selectedShapeId && (
        <Resizer
          shapeId={shape._id}
          shapeProps={shapeProps}
          shapeRef={shapeRef}
          onClose={onBlur}
          onMouseDown={handleMouseDown}
          onReset={resetEditText}
          onDeleteShape={onDeleteShape}
          {...(typeof onEditStickyNote === "function" && { onEditStickyNote })}
        />
      )}
    </Fragment>
  );
};

export default Shapes;

export const InactiveShapes = ({
  shape,
}: {
  shape: {
    type: ShapeTypes;
    props: ShapeProps;
  };
}) => {
  let [shapeProps, setShapeProps] = useState<ShapeProps | null>(null);

  useEffect(() => {
    setShapeProps(shape.props);
  }, [shape.props]);

  let shapeComponent = useMemo(() => {
    if (!shapeProps) return null;

    let { width, height, backgroundColor, borderColor, text } = shapeProps;

    switch (shape.type) {
      case "sticky-note":
        return <StickyNote text={text} style={{ backgroundColor }} />;

      case "text-box":
        return <TextBox defaultValue={text} readOnly />;

      case "arrow":
        return (
          <Arrow
            width={width}
            height={height}
            borderColor={borderColor}
            backgroundColor={backgroundColor}
          />
        );

      case "circle":
        return (
          <Circle
            width={width}
            height={height}
            borderColor={borderColor}
            backgroundColor={backgroundColor}
          />
        );

      case "diamond":
        return (
          <Diamond
            width={width}
            height={height}
            borderColor={borderColor}
            backgroundColor={backgroundColor}
          />
        );

      case "rectangle":
        return (
          <Rectangle
            width={width}
            height={height}
            borderColor={borderColor}
            backgroundColor={backgroundColor}
          />
        );

      case "square":
        return (
          <Square
            width={width}
            height={height}
            borderColor={borderColor}
            backgroundColor={backgroundColor}
          />
        );

      case "triangle":
        return (
          <Triangle
            width={width}
            height={height}
            borderColor={borderColor}
            backgroundColor={backgroundColor}
          />
        );

      default:
        return null;
    }
  }, [
    shape.type,
    shapeProps?.width,
    shapeProps?.height,
    shapeProps?.backgroundColor,
    shapeProps?.borderColor,
    shapeProps?.text,
  ]);

  if (!shapeProps) return null;

  return (
    <div
      className={styles.container}
      style={{
        width: `${shapeProps.width}px`,
        height: `${shapeProps.height}px`,
        transform: `translate(${shapeProps.translateX}px, ${shapeProps.translateY}px) rotate(${shapeProps.rotate}deg)`,
      }}
    >
      {shapeComponent}
    </div>
  );
};

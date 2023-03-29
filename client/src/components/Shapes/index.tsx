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
import SemiCircle from "./SemiCircle";
import Square from "./Square";
import Triangle from "./Triangle";
import Arrow from "./Arrow";
import StickyNote from "./StickyNote";
import TextBox from "./TextBox";
import Resizer from "../Resizer";
import { debounce } from "@/utils";
import { ShapeDetail, ShapeProps, ResizeType } from "@/types/Document";

import styles from "./Shape.module.scss";

type Shape = {
  shape: ShapeDetail;
  selectedShapeId?: string | null;
  slideId?: string;
  onUpdateShape?: (shape: Omit<ShapeDetail, "type">) => void;
  onClick?: (id: string) => void;
  onBlur?: () => void;
};

type ResizerRef = {
  containerRef: HTMLDivElement | null;
  handleMouseDown: (event: MouseEvent, type: "move") => void;
  removeMouseListeners: () => void;
};

type MouseDownEvent = {
  type: ResizeType;
  pageX: number;
  pageY: number;
};

const Shapes = ({
  shape,
  selectedShapeId,
  onClick,
  onBlur,
  onUpdateShape,
}: Shape) => {
  let [shapeProps, setShapeProps] = useState<ShapeProps | null>(null);

  let [isReadOnly, setIsReadOnly] = useState(true);

  let resizerRef = useRef<ResizerRef>();

  let shapeRef = useRef<HTMLDivElement | null>(null);

  let mouseDownEvent = useRef<MouseDownEvent | null>(null);

  let textChange = debounce<Omit<ShapeDetail, "type">>(
    (props) => onUpdateShape?.(props),
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

    let { width, height, text } = shapeProps;

    switch (shape.type) {
      case "sticky-note":
        return <StickyNote text="Hello World" />;

      case "text-box":
        return (
          <TextBox
            defaultValue={text}
            readOnly={isReadOnly}
            onChange={handleChangeText}
          />
        );

      case "arrow":
        return <Arrow width={width} height={height} />;

      case "circle":
        return <Circle width={width} height={height} />;

      case "diamond":
        return <Diamond width={width} height={height} />;

      case "rectangle":
        return <Rectangle width={width} height={height} />;

      case "semi-circle":
        return <SemiCircle width={width} height={height} />;

      case "square":
        return <Square width={width} height={height} />;

      case "triangle":
        return <Triangle width={width} height={height} />;

      default:
        return null;
    }
  }, [shape.type, shapeProps?.width, shapeProps?.height, isReadOnly]);

  let handleMouseMove = ({ x, y }: MouseEvent) => {
    if (!shapeProps || !mouseDownEvent.current || !shapeRef.current) return;

    let { pageX, pageY, type } = mouseDownEvent.current;

    let props = {
      ...shapeProps,
    };

    let { width, height } =
      shapeRef.current.parentElement!.getBoundingClientRect();
    let { clientWidth, clientHeight } = shapeRef.current.parentElement!;

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
      if (props) onUpdateShape?.({ _id: shape._id, props });
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
    resizerRef.current?.removeMouseListeners();
    setIsReadOnly(false);
  };

  let handleClickShape = () => {
    onClick?.(shape._id);
  };

  let resetEditText = () => {
    if (!isReadOnly) setIsReadOnly(true);
  };

  if (!shapeProps) return null;

  return (
    <Fragment>
      <div
        ref={shapeRef}
        className={styles.container}
        onClick={handleClickShape}
        style={{
          width: `${shapeProps.width}px`,
          height: `${shapeProps.height}px`,
          transform: `translate(${shapeProps.translateX}px, ${shapeProps.translateY}px) rotate(${shapeProps.rotate}deg)`,
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
          shapeRef={shapeRef.current}
          onClose={onBlur}
          onMouseDown={handleMouseDown}
          onReset={resetEditText}
        />
      )}
    </Fragment>
  );
};

export default Shapes;

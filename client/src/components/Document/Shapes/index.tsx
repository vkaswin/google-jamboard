import {
  Fragment,
  useMemo,
  useRef,
  useState,
  MouseEvent,
  ChangeEvent,
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
import { updateShape } from "@/services/Shape";
import { debounce } from "@/utils";
import { ShapeDetail, ShapeProps } from "@/types/Document";

import styles from "./Shape.module.scss";

type Shape = {
  shape: ShapeDetail;
  selectedShapeId?: string | null;
  onClick?: (id: string) => void;
  onBlur?: () => void;
};

type ResizerRef = {
  containerRef: HTMLDivElement | null;
  handleMouseDown: (event: MouseEvent, type: "move") => void;
  removeMouseListeners: () => void;
};

const Shapes = ({ shape, selectedShapeId, onClick, onBlur }: Shape) => {
  let [property, setProperty] = useState<ShapeProps>(shape.props);

  let [isReadOnly, setIsReadOnly] = useState(true);

  let resizerRef = useRef<ResizerRef>();

  let shapeRef = useRef<HTMLDivElement | null>(null);

  let handleShapeChange = (props: ShapeProps) => {
    setProperty(props);
  };

  let handleUpdateShape = async (props: ShapeProps) => {
    await updateShape(shape._id, { props });
  };

  let textChange = debounce(handleUpdateShape, 2000);

  let handleChangeText = ({
    target: { value, scrollHeight },
  }: ChangeEvent<HTMLTextAreaElement>) => {
    let props = { ...property, height: scrollHeight, text: value };
    textChange(props);
    setProperty(props);
  };

  let shapeComponent = useMemo(() => {
    let { width, height, text } = property;

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
  }, [shape.type, property.width, property.height, isReadOnly]);

  let { width, height, translateX, translateY, rotate } = property;

  let handleMouseDown = (event: MouseEvent) => {
    resizerRef.current?.handleMouseDown(event, "move");
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

  return (
    <Fragment>
      <div
        ref={shapeRef}
        className={styles.container}
        onClick={handleClickShape}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: `translate(${translateX}px, ${translateY}px) rotate(${rotate}rad)`,
        }}
      >
        {shapeComponent}
        {shape._id === selectedShapeId && (
          <div
            className={styles.overlay}
            onDoubleClick={handleDoubleClick}
            onMouseDown={handleMouseDown}
            style={{
              cursor: isReadOnly ? "move" : "default",
              pointerEvents: isReadOnly ? "auto" : "none",
            }}
          ></div>
        )}
      </div>
      {shape._id === selectedShapeId && (
        <Resizer
          ref={resizerRef}
          shapeId={shape._id}
          shapeType={shape.type}
          property={property}
          shapeRef={shapeRef.current}
          onClose={onBlur}
          resetEditText={resetEditText}
          onChange={handleShapeChange}
          onPropertyChange={handleUpdateShape}
        />
      )}
    </Fragment>
  );
};

export default Shapes;

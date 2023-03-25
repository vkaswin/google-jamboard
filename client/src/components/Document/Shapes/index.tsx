import { Fragment, useMemo, useState } from "react";
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
import { ShapeDetail, ShapeProps } from "@/types/Document";

import styles from "./Shape.module.scss";

type Shape = {
  shape: ShapeDetail;
  selectedShapeId: string | null;
  onClick: (id: string) => void;
};

const Shapes = ({ shape, selectedShapeId, onClick }: Shape) => {
  let [property, setProperty] = useState<ShapeProps>(shape.props);

  let shapeComponent = useMemo(() => {
    let { width, height } = property;

    switch (shape.type) {
      case "arrow":
        return <StickyNote text="Hello World" />;

      case "circle":
        return <TextBox text="Hello World" />;

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
  }, [shape.type, property.width, property.height]);

  let handleShapeChange = (props: ShapeProps) => {
    setProperty(props);
  };

  let handleUpdateShape = async (props: ShapeProps) => {
    await updateShape(shape._id, { props });
  };

  let { width, height, translateX, translateY, rotate } = property;

  return (
    <Fragment>
      <div
        shape-id={shape._id}
        className={`${styles.container} ${
          shape._id === selectedShapeId ? styles.selected : ""
        } `.trim()}
        onClick={() => onClick(shape._id)}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: `translate(${translateX}px, ${translateY}px) scale(1) rotate(${rotate}rad)`,
        }}
      >
        {shapeComponent}
      </div>
      {shape._id === selectedShapeId && (
        <Resizer
          shapeId={shape._id}
          property={property}
          onChange={handleShapeChange}
          onUpdateShape={handleUpdateShape}
        />
      )}
    </Fragment>
  );
};

export default Shapes;

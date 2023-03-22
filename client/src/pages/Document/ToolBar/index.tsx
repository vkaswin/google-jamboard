import { Fragment, useState } from "react";
import SketchOptions from "./SketchOptions";
import ShapeOptions from "./ShapeOptions";
import { toolBarIcons, shapes, sketches } from "@/constants";

import styles from "./ToolBar.module.scss";
import ToolTip from "@/components/ToolTip";

type ToolBarProps = {
  shape: number;
  sketch: number;
  sketchColor: number;
  tool: number;
  onSelectTool: (index: number) => void;
  onSelectShape: (index: number) => void;
  onSelectSketch: (index: number) => void;
  onSelectSketchColor: (index: number) => void;
  onClearFrame: () => void;
};

const ToolBar = ({
  tool,
  sketch,
  shape,
  sketchColor,
  onSelectTool,
  onSelectShape,
  onSelectSketch,
  onSelectSketchColor,
  onClearFrame,
}: ToolBarProps) => {
  let [showShape, setShowShape] = useState(false);

  let [showSketch, setShowSketch] = useState(false);

  let toggleShape = () => {
    setShowShape(!showShape);
  };

  let toggleSketch = () => {
    setShowSketch(!showSketch);
  };

  let handleToolBar = (index: number, type: string) => {
    if ((type === "shape" || type === "sketch") && tool === index) {
      if (type === "shape") toggleShape();
      else if (type === "sketch") toggleSketch();
    }

    if (tool !== index) onSelectTool(index);
  };

  return (
    <Fragment>
      <div className={styles.container}>
        <button className={styles.redo} disabled>
          <i className="bx-undo"></i>
        </button>
        <button className={styles.undo} disabled>
          <i className="bx-redo"></i>
        </button>
        <div className={styles.separator}></div>
        <button className={styles.zoom_out}>
          <i className="bx-zoom-out"></i>
        </button>
        <button className={styles.zoom_in}>
          <i className="bx-zoom-in"></i>
        </button>
        <div className={styles.separator}></div>
        <button className={styles.background_btn}>Set background</button>
        <div className={styles.separator}></div>
        <button className={styles.clear_btn} onClick={onClearFrame}>
          Clear frame
        </button>
      </div>
      <div className={styles.toolbar}>
        {toolBarIcons.map(({ label, svg }, index) => {
          let icon =
            label === "shape"
              ? shapes[shape].svg
              : label === "sketch"
              ? sketches[sketch].svg
              : svg;

          let title =
            label === "shape"
              ? shapes[shape].label
              : label === "sketch"
              ? sketches[sketch].label
              : label;

          let className = index === tool ? styles.active : undefined;

          let id =
            label === "shape"
              ? "shapes"
              : label === "sketch"
              ? "sketches"
              : `toolbar-${index}`;

          return (
            <Fragment key={index}>
              <button
                id={id}
                className={className}
                onClick={() => handleToolBar(index, label)}
              >
                {icon}
                {(label === "shape" || label === "sketch") && (
                  <i className="bxs-right-arrow"></i>
                )}
              </button>
              <ToolTip selector={`#toolbar-${index}`} placement="right">
                {title}
              </ToolTip>
            </Fragment>
          );
        })}
      </div>
      <ShapeOptions
        isOpen={showShape}
        shape={shape}
        toggle={toggleShape}
        onSelectShape={onSelectShape}
      />
      <SketchOptions
        isOpen={showSketch}
        sketch={sketch}
        sketchColor={sketchColor}
        toggle={toggleSketch}
        onSelectSketch={onSelectSketch}
        onSelectSketchColor={onSelectSketchColor}
      />
    </Fragment>
  );
};

export default ToolBar;

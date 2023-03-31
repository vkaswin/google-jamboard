import { CSSProperties, Fragment, useState } from "react";
import ToolTip from "@/components/ToolTip";
import SketchOptions from "./SketchOptions";
import ShapeOptions from "./ShapeOptions";
import BackGroundOptions from "./BackGroundOptions";
import ColorOptions from "./ColorOptions";
import { toolBarIcons, shapes, sketches, colors } from "@/constants";
import { BackGroundCode, Colors } from "@/types/Document";

import styles from "./ToolBar.module.scss";

type ToolBarProps = {
  shape: number;
  sketch: number;
  sketchColor: number;
  slideBackGround?: BackGroundCode;
  tool: number;
  borderColor: Colors;
  backgroundColor: Colors;
  selectedShapeId: string | null;
  onSelectTool: (index: number) => void;
  onSelectShape: (index: number) => void;
  onSelectSketch: (index: number) => void;
  onClearSlide: () => void;
  onSelectBackGround: (bgCode: BackGroundCode) => void;
  onSelectSketchColor: (index: number) => void;
  onSelectBorderColor: (key: "borderColor", colorCode: Colors) => void;
  onSelectBackGroundColor: (key: "backgroundColor", colorCode: Colors) => void;
};

const ToolBar = ({
  tool,
  sketch,
  shape,
  sketchColor,
  slideBackGround,
  borderColor,
  backgroundColor,
  selectedShapeId,
  onClearSlide,
  onSelectTool,
  onSelectShape,
  onSelectSketch,
  onSelectSketchColor,
  onSelectBackGround,
  onSelectBorderColor,
  onSelectBackGroundColor,
}: ToolBarProps) => {
  let [showShape, setShowShape] = useState(false);

  let [showSketch, setShowSketch] = useState(false);

  let [showBackGround, setShowBackGround] = useState(false);

  let [showBordorColor, setShowBorderColor] = useState(false);

  let [showBackGroundColor, setShowBackGroundColor] = useState(false);

  let toggleBackGround = () => {
    setShowBackGround(!showBackGround);
  };

  let toggleShape = () => {
    setShowShape(!showShape);
  };

  let toggleSketch = () => {
    setShowSketch(!showSketch);
  };

  let toggleBackGroundColor = () => {
    setShowBackGroundColor(!showBackGroundColor);
  };

  let toggleBorderColor = () => {
    setShowBorderColor(!showBordorColor);
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
      <div className={styles.toolbar}>
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
        {tool !== 4 && tool !== 5 && !selectedShapeId && (
          <Fragment>
            <button
              id="backgrounds"
              className={styles.background_btn}
              onClick={toggleBackGround}
            >
              Set background
            </button>
            <div className={styles.separator}></div>
            <button className={styles.clear_btn} onClick={onClearSlide}>
              Clear frame
            </button>
          </Fragment>
        )}
        {(tool === 4 || selectedShapeId) && (
          <div className={styles.color_btn}>
            <button
              id="border"
              onClick={toggleBorderColor}
              style={{ "--bg": borderColor } as CSSProperties}
            >
              <i className="bxs-pencil"></i>
            </button>
            <button
              id="background"
              onClick={toggleBackGroundColor}
              style={{ "--bg": backgroundColor } as CSSProperties}
            >
              <i className="bxs-color-fill"></i>
            </button>
          </div>
        )}
      </div>
      <div className={styles.container}>
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

          let background =
            label === "sketch" ? colors[sketchColor].colorCode : undefined;

          return (
            <Fragment key={index}>
              <button
                id={id}
                className={className}
                onClick={() => handleToolBar(index, label)}
                style={{ "--bgColor": background } as CSSProperties}
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
      {showShape && (
        <ShapeOptions
          isOpen={showShape}
          shape={shape}
          toggle={toggleShape}
          onSelectShape={onSelectShape}
        />
      )}
      {showSketch && (
        <SketchOptions
          isOpen={showSketch}
          sketch={sketch}
          sketchColor={sketchColor}
          toggle={toggleSketch}
          onSelectSketch={onSelectSketch}
          onSelectSketchColor={onSelectSketchColor}
        />
      )}
      {showBackGround && (
        <BackGroundOptions
          isOpen={showBackGround}
          background={slideBackGround}
          toggle={toggleBackGround}
          onSelectBackGround={onSelectBackGround}
        />
      )}
      {showBordorColor && (
        <ColorOptions
          id="border"
          isOpen={showBordorColor}
          color={borderColor}
          toggle={toggleBorderColor}
          onSelectColor={(colorCode) =>
            onSelectBorderColor("borderColor", colorCode)
          }
        />
      )}
      {showBackGroundColor && (
        <ColorOptions
          id="background"
          isOpen={showBackGroundColor}
          color={backgroundColor}
          toggle={toggleBackGroundColor}
          onSelectColor={(colorCode) =>
            onSelectBackGroundColor("backgroundColor", colorCode)
          }
        />
      )}
    </Fragment>
  );
};

export default ToolBar;

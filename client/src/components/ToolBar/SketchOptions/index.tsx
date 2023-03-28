import { CSSProperties, Fragment } from "react";
import Popper from "@/components/Popper";
import ToolTip from "@/components/ToolTip";
import { sketches, colors } from "@/constants";

import styles from "./Sketches.module.scss";

type SketchProps = {
  isOpen: boolean;
  sketch: number;
  sketchColor: number;
  toggle: () => void;
  onSelectSketch: (index: number) => void;
  onSelectSketchColor: (index: number) => void;
};

const SketchOptions = ({
  isOpen,
  sketch,
  sketchColor,
  toggle,
  onSelectSketch,
  onSelectSketchColor,
}: SketchProps) => {
  let handleSketch = (index: number) => {
    onSelectSketch(index);
    toggle();
  };

  let handleColor = (index: number) => {
    onSelectSketchColor(index);
    toggle();
  };

  return (
    <Popper
      className={styles.container}
      isOpen={isOpen}
      selector="#sketches"
      toggle={toggle}
    >
      {/* <div className={styles.sketch}>
        {sketches.map(({ label, svg }, index) => {
          let className = index === sketch ? styles.active : undefined;

          let color =
            colors[sketchColor].colorCode === "#FFFFFF"
              ? colors[0].colorCode
              : colors[sketchColor].colorCode;

          return (
            <Fragment key={index}>
              <button
                id={`sketch-${index}`}
                className={className}
                onClick={() => handleSketch(index)}
                style={{ "--sketch": color } as CSSProperties}
              >
                {svg}
              </button>
              <ToolTip selector={`#sketch-${index}`} placement="bottom">
                {label}
              </ToolTip>
            </Fragment>
          );
        })}
      </div> */}
      <div className={styles.color}>
        {colors.map(({ label, colorCode }, index) => {
          let className = index === sketchColor ? styles.active : undefined;

          return (
            <Fragment key={index}>
              <button
                id={`color-${index}`}
                className={className}
                onClick={() => handleColor(index)}
              >
                <span style={{ backgroundColor: colorCode }}></span>
              </button>
              <ToolTip selector={`#color-${index}`} placement="bottom">
                {label}
              </ToolTip>
            </Fragment>
          );
        })}
      </div>
    </Popper>
  );
};

export default SketchOptions;

import { Fragment, useLayoutEffect, useState } from "react";
import ToolTip from "@/components/ToolTip";
import { sketches, colors } from "@/constants";
import { usePopper } from "react-popper";

import styles from "./Sketches.module.scss";

type SketchProps = {
  sketch: number;
  sketchColor: number;
  onSelectSketch: (index: number) => void;
  onSelectSketchColor: (index: number) => void;
};

const Sketches = ({
  sketch,
  sketchColor,
  onSelectSketch,
  onSelectSketchColor,
}: SketchProps) => {
  let [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null
  );
  let [popperElement, setPopperElement] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    let element = document.querySelector<HTMLElement>("#sketches");
    if (!element) return;
    setReferenceElement(element);
  }, []);

  const { attributes, styles: style } = usePopper(
    referenceElement,
    popperElement,
    {
      placement: "right",
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 10],
          },
        },
      ],
    }
  );

  return (
    <div
      ref={setPopperElement}
      className={styles.container}
      style={{
        ...style.popper,
      }}
      {...attributes}
    >
      <div className={styles.sketch}>
        {sketches.map(({ label, svg }, index) => {
          return (
            <Fragment key={index}>
              <button id={`sketch-${index}`}>{svg}</button>
              <ToolTip selector={`#sketch-${index}`} placement="bottom">
                {label}
              </ToolTip>
            </Fragment>
          );
        })}
      </div>
      <div className={styles.color}>
        {colors.map(({ label, colorCode }, index) => {
          return (
            <Fragment key={index}>
              <button id={`color-${index}`}>
                <span style={{ backgroundColor: colorCode }}></span>
              </button>
              <ToolTip selector={`#color-${index}`} placement="bottom">
                {label}
              </ToolTip>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Sketches;

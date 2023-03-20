import { Fragment, useLayoutEffect, useState } from "react";
import ToolTip from "@/components/ToolTip";
import { sketches, colors, shapes } from "@/constants";
import { usePopper } from "react-popper";

import styles from "./Shapes.module.scss";

type ShapeProps = {
  shape: number;
  onChange: (index: number) => void;
};

const Shapes = ({ shape, onChange }: ShapeProps) => {
  let [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null
  );
  let [popperElement, setPopperElement] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    let element = document.querySelector<HTMLElement>("#shapes");
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
      <div className={styles.shape}>
        {shapes.map(({ label, svg }, index) => {
          return (
            <Fragment key={index}>
              <button id={`shape-${index}`}>{svg}</button>
              <ToolTip selector={`#shape-${index}`} placement="bottom">
                {label}
              </ToolTip>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Shapes;

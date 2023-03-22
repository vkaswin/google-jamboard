import { Fragment } from "react";
import ToolTip from "@/components/ToolTip";
import { shapes } from "@/constants";

import styles from "./Shapes.module.scss";
import Popper from "@/components/Popper";

type ShapeProps = {
  isOpen: boolean;
  shape: number;
  toggle: () => void;
  onSelectShape: (index: number) => void;
};

const Shapes = ({ shape, isOpen, toggle, onSelectShape }: ShapeProps) => {
  let handleClick = (index: number) => {
    onSelectShape(index);
    toggle();
  };

  return (
    <Popper
      className={styles.container}
      isOpen={isOpen}
      selector="#shapes"
      toggle={toggle}
    >
      <div className={styles.shape}>
        {shapes.map(({ label, svg }, index) => {
          return (
            <Fragment key={index}>
              <button id={`shape-${index}`} onClick={() => handleClick(index)}>
                {svg}
              </button>
              <ToolTip selector={`#shape-${index}`} placement="bottom">
                {label}
              </ToolTip>
            </Fragment>
          );
        })}
      </div>
    </Popper>
  );
};

export default Shapes;

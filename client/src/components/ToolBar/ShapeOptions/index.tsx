import { Fragment, useEffect, useRef } from "react";
import ToolTip from "@/components/ToolTip";
import Popper from "@/components/Popper";
import { clickOutside } from "@/utils";
import { shapes } from "@/constants";

import styles from "./Shapes.module.scss";

type ShapeProps = {
  isOpen: boolean;
  shape: number;
  toggle: () => void;
  onSelectShape: (index: number) => void;
};

const ShapeOptions = ({ shape, isOpen, toggle, onSelectShape }: ShapeProps) => {
  let containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || !isOpen) return;

    let unRegister = clickOutside({
      ref: containerRef.current,
      onClose: toggle,
      doNotClose: (ele) => {
        return containerRef.current?.contains(ele);
      },
    });
    return () => {
      unRegister();
    };
  }, [isOpen]);

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
      <div ref={containerRef} className={styles.shape}>
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

export default ShapeOptions;

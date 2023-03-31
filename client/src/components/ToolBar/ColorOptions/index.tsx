import { Fragment } from "react";
import Popper from "@/components/Popper";
import ToolTip from "@/components/ToolTip";
import { colors } from "@/constants";
import { Colors } from "@/types/Document";

import styles from "./ColorOptions.module.scss";

type SketchProps = {
  id: "border" | "background";
  isOpen: boolean;
  color: Colors;
  toggle: () => void;
  onSelectColor: (colorCode: Colors) => void;
};

const ColorOptions = ({
  id,
  isOpen,
  color,
  toggle,
  onSelectColor,
}: SketchProps) => {
  let handleColor = (colorCode: Colors) => {
    onSelectColor(colorCode);
    toggle();
  };

  return (
    <Popper
      id={`${id}-dropdown`}
      className={styles.container}
      isOpen={isOpen}
      selector={`#${id}`}
      placement="bottom-start"
      toggle={toggle}
    >
      <div className={styles.color}>
        {colors.map(({ label, colorCode }, index) => {
          let className = colorCode === color ? styles.active : undefined;
          return (
            <Fragment key={index}>
              <button
                id={`${id}-${index}`}
                className={className}
                onClick={() => handleColor(colorCode)}
              >
                <span style={{ backgroundColor: colorCode }}></span>
              </button>
              <ToolTip selector={`#${id}-${index}`} placement="bottom">
                {label}
              </ToolTip>
            </Fragment>
          );
        })}
      </div>
    </Popper>
  );
};

export default ColorOptions;

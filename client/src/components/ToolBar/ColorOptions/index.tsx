import { Fragment, useEffect, useRef } from "react";
import Popper from "@/components/Popper";
import ToolTip from "@/components/ToolTip";
import { clickOutside } from "@/utils";
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
      <div ref={containerRef} className={styles.color}>
        {colors.map(({ label, colorCode, lightColorCode }, index) => {
          let code = id === "background" ? lightColorCode : colorCode;
          let className = code === color ? styles.active : undefined;
          return (
            <Fragment key={index}>
              <button
                id={`${id}-${index}`}
                className={className}
                onClick={() => handleColor(code)}
              >
                <span
                  style={{
                    backgroundColor: code,
                  }}
                ></span>
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

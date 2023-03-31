import { CSSProperties, Fragment, useEffect, useRef } from "react";
import Popper from "@/components/Popper";
import ToolTip from "@/components/ToolTip";
import { clickOutside } from "@/utils";
import { backGrounds } from "@/constants";
import { getStaticUrl } from "@/utils";
import { BackGroundCode } from "@/types/Document";

import styles from "./BackGroundOptions.module.scss";

type ShapeProps = {
  isOpen: boolean;
  background?: BackGroundCode;
  toggle: () => void;
  onSelectBackGround: (bgCode: BackGroundCode) => void;
};

const BackGroundOptions = ({
  background,
  isOpen,
  toggle,
  onSelectBackGround,
}: ShapeProps) => {
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

  let handleClick = (bgCode: BackGroundCode) => {
    onSelectBackGround(bgCode);
    toggle();
  };

  return (
    <Popper
      className={styles.container}
      isOpen={isOpen}
      selector="#backgrounds"
      placement="bottom-start"
      toggle={toggle}
    >
      <div ref={containerRef} className={styles.bg}>
        {backGrounds.map(({ label, bgCode }, index) => {
          let isActive = background === bgCode;
          return (
            <Fragment key={index}>
              <button
                id={`background-${index}`}
                onClick={() => handleClick(bgCode)}
                className={isActive ? styles.active : undefined}
                style={
                  {
                    "--bg": `url(${getStaticUrl(
                      `/background-icon/${bgCode}.svg`
                    )})`,
                  } as CSSProperties
                }
              >
                {isActive && <img src={getStaticUrl("/check.svg")} />}
              </button>
              <ToolTip selector={`#background-${index}`} placement="bottom">
                {label}
              </ToolTip>
            </Fragment>
          );
        })}
      </div>
    </Popper>
  );
};

export default BackGroundOptions;

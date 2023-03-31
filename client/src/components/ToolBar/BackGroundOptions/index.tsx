import { CSSProperties, Fragment } from "react";
import Popper from "@/components/Popper";
import ToolTip from "@/components/ToolTip";
import { backGrounds } from "@/constants";
import { getStaticUrl } from "@/utils";
import { BacKGroundCode } from "@/types/Document";

import styles from "./BackGroundOptions.module.scss";

type ShapeProps = {
  isOpen: boolean;
  background?: BacKGroundCode;
  toggle: () => void;
  onSelectBackGround: (bgCode: BacKGroundCode) => void;
};

const BackGroundOptions = ({
  background,
  isOpen,
  toggle,
  onSelectBackGround,
}: ShapeProps) => {
  let handleClick = (bgCode: BacKGroundCode) => {
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
      <div className={styles.bg}>
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

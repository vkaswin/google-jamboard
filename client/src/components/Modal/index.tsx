import { ReactNode } from "react";
import { CSSTransition } from "react-transition-group";
import Portal from "@/components/Portal";

import styles from "./Modal.module.scss";

type ModalProps = {
  size?: "sm" | "md" | "lg";
  isOpen: boolean;
  children: ReactNode;
  closeClickOnOutSide?: boolean;
  toggle: () => void;
};

const Modal = ({
  isOpen,
  children,
  size = "md",
  closeClickOnOutSide = true,
  toggle,
}: ModalProps) => {
  let handleClick = () => {
    if (!isOpen) return;
    toggle();
  };

  return (
    <Portal>
      <CSSTransition
        in={isOpen}
        timeout={300}
        unmountOnExit
        classNames={{ enterActive: styles.enter, exitActive: styles.exit }}
      >
        <div>
          <div
            className={styles.container}
            {...(closeClickOnOutSide && { onClick: handleClick })}
          >
            <div className={styles.dialog}>
              <div
                data-size={size}
                className={styles.content}
                onClick={(e) => e.stopPropagation()}
              >
                {children}
              </div>
            </div>
          </div>
          <div className={styles.overlay}></div>
        </div>
      </CSSTransition>
    </Portal>
  );
};

export default Modal;

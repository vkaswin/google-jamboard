import { ComponentProps, ReactNode, useLayoutEffect, useState } from "react";
import { usePopper } from "react-popper";
import { CSSTransition } from "react-transition-group";
import Portal from "@/components/Portal";
import { clickOutside } from "@/utils";

import styles from "./Popper.module.scss";
import { Placement } from "@/types/Popper";

type PopperProps = {
  children: ReactNode;
  selector: string;
  isOpen: boolean;
  placement?: Placement;
  toggle: () => void;
} & ComponentProps<"div">;

const Popper = ({
  children,
  selector,
  isOpen,
  placement = "right",
  toggle,
  ...rest
}: PopperProps) => {
  let [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null
  );
  let [popperElement, setPopperElement] = useState<HTMLElement | null>(null);

  const { attributes, styles: style } = usePopper(
    referenceElement,
    popperElement,
    {
      placement,
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

  useLayoutEffect(() => {
    let element = document.querySelector<HTMLElement>(selector);
    if (!element) return;
    setReferenceElement(element);
  }, []);

  const onEntered = (element: HTMLElement) => {
    if (!element) return;

    clickOutside({
      ref: element,
      onClose: toggle,
      doNotClose: (event) => {
        if (!referenceElement) return false;
        return referenceElement.contains(event);
      },
    });
  };

  return (
    <Portal>
      <CSSTransition
        in={isOpen}
        timeout={200}
        unmountOnExit
        classNames={{
          enterActive: styles.enter,
          exitActive: styles.exit,
        }}
        onEntered={onEntered}
      >
        <div
          ref={setPopperElement}
          style={{
            ...style.popper,
          }}
          {...attributes.popper}
          {...rest}
        >
          {children}
        </div>
      </CSSTransition>
    </Portal>
  );
};

export default Popper;

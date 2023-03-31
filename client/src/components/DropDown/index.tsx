import {
  ReactNode,
  useEffect,
  useState,
  createContext,
  useContext,
  ComponentProps,
  MouseEvent,
} from "react";
import { CSSTransition } from "react-transition-group";
import { usePopper } from "react-popper";
import Portal from "@/components/Portal";
import { clickOutside } from "@/utils";
import { Placement } from "@/types/Popper";

import styles from "./DropDown.module.scss";

type DropDownProps = {
  selector: string;
  children?: ReactNode;
  placement?: Placement;
} & ComponentProps<"div">;

type DropDownContextType = {
  close: () => void;
};

const DropDownContext = createContext<DropDownContextType | null>(null);

const DropDown = ({
  placement = "bottom-start",
  className,
  selector,
  children,
  ...props
}: DropDownProps) => {
  let [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null
  );
  let [popperElement, setPopperElement] = useState<HTMLElement | null>(null);

  const {
    attributes,
    styles: style,
    state,
  } = usePopper(referenceElement, popperElement, {
    placement,
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 10],
        },
      },
    ],
  });

  const [show, setShow] = useState(false);

  const open = () => {
    setShow(true);
  };

  const close = () => {
    setShow(false);
  };

  useEffect(() => {
    if (selector.length === 0) return;

    if (referenceElement) referenceElement.removeEventListener("click", open);

    const element = document.querySelector(selector) as HTMLElement;

    if (!element) return;

    element.addEventListener("click", open);

    setReferenceElement(element);

    return () => {
      if (referenceElement) referenceElement.removeEventListener("click", open);
    };
  }, [selector]);

  const onEntered = (element: HTMLElement) => {
    if (!element) return;

    clickOutside({
      ref: element,
      onClose: close,
      doNotClose: (event) => {
        if (!referenceElement) return false;
        return referenceElement.contains(event);
      },
    });
  };

  return (
    <Portal>
      <CSSTransition
        in={show}
        timeout={200}
        unmountOnExit
        classNames={{
          enterActive: styles.enter,
          exitActive: styles.exit,
        }}
        onEntered={onEntered}
      >
        <DropDownContext.Provider value={{ close: close }}>
          <div
            ref={setPopperElement}
            className={`${styles.container} ${className || ""}`.trim()}
            style={{
              ...style.popper,
            }}
            {...attributes.popper}
            {...props}
          >
            <div className={styles.menu}>{children}</div>
          </div>
        </DropDownContext.Provider>
      </CSSTransition>
    </Portal>
  );
};

type DropDownItemProps = {
  children?: ReactNode;
  className?: string;
  onClick?: (event: MouseEvent) => void;
} & ComponentProps<"button">;

export const Item = ({
  children,
  onClick,
  className,
  ...props
}: DropDownItemProps) => {
  const { close } = useContext(DropDownContext) as DropDownContextType;

  const handleClick = (event: MouseEvent): void => {
    close();
    if (typeof onClick === "function") onClick(event);
  };

  return (
    <button
      className={`${styles.item} ${className ? className : ""}`.trim()}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};

DropDown.Item = Item;

export default DropDown;

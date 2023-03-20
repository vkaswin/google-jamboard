import { ComponentProps, ReactNode, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePopper } from "react-popper";

type PopperProps = {
  children: ReactNode;
  selector: string;
  toggle: () => void;
} & ComponentProps<"div">;

const Popper = ({ children, selector, toggle, ...rest }: PopperProps) => {
  let [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null
  );
  let [popperElement, setPopperElement] = useState<HTMLElement | null>(null);

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

  useLayoutEffect(() => {
    let element = document.querySelector<HTMLElement>(selector);
    if (!element) return;
    setReferenceElement(element);
  }, []);

  return createPortal(
    <div
      ref={setPopperElement}
      style={{
        ...style.popper,
      }}
      {...attributes.popper}
      {...rest}
    >
      {children}
    </div>,
    document.body
  );
};

export default Popper;

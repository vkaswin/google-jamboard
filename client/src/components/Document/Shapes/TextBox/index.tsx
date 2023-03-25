import { ComponentProps, useEffect, useRef } from "react";

import styles from "./TextBox.module.scss";

type TextBoxProps = ComponentProps<"textarea">;

const TextBox = ({ readOnly, ...rest }: TextBoxProps) => {
  let inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!inputRef.current || readOnly) return;
    inputRef.current.focus();
  }, [readOnly]);

  return (
    <div className={styles.container}>
      <textarea ref={inputRef} readOnly={readOnly} {...rest} />
    </div>
  );
};

export default TextBox;

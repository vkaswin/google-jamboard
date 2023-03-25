import { useRef } from "react";

import styles from "./TextBox.module.scss";

type TextBoxProps = { text: string };

const TextBox = ({ text }: TextBoxProps) => {
  let inputRef = useRef<HTMLTextAreaElement | null>(null);

  return (
    <div className={styles.container}>
      <textarea ref={inputRef} defaultValue={text} readOnly />
    </div>
  );
};

export default TextBox;

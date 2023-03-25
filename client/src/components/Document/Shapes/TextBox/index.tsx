import React from "react";

import styles from "./TextBox.module.scss";

type TextBoxProps = { text: string };

const TextBox = ({ text }: TextBoxProps) => {
  return (
    <div className={styles.container}>
      <textarea defaultValue={text} readOnly />
    </div>
  );
};

export default TextBox;

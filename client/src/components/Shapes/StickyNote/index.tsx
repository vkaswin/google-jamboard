import React from "react";

import styles from "./StickyNote.module.scss";

type StickyNoteProps = {
  text: string;
  backgroundColor?: string;
};

const StickyNote = ({ text, backgroundColor = "#fff" }: StickyNoteProps) => {
  return (
    <div
      className={styles.container}
      style={{ backgroundColor: backgroundColor || undefined }}
    >
      <h2>{text}</h2>
    </div>
  );
};

export default StickyNote;

import { ComponentProps } from "react";

import styles from "./StickyNote.module.scss";

type StickyNoteProps = {
  text?: string;
} & ComponentProps<"div">;

const StickyNote = ({ text, ...rest }: StickyNoteProps) => {
  return (
    <div className={styles.container} {...rest}>
      <h2>{text}</h2>
    </div>
  );
};

export default StickyNote;

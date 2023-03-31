import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/Modal";

import styles from "./EditPopup.module.scss";

type EditPopupProps = {
  isOpen: boolean;
  text?: string;
  toggle: () => void;
  onSubmit: (value: string) => void;
};

const EditPopup = ({ isOpen, text, toggle, onSubmit }: EditPopupProps) => {
  let {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<{ text: string }>();

  useEffect(() => {
    if (isOpen) return;
    setValue("text", "");
    reset();
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      size="sm"
      closeClickOnOutSide={false}
    >
      <div className={styles.container}>
        <div className={styles.title}>
          <span>Rename Jam</span>
        </div>
        <div className={styles.form}>
          <label htmlFor="title">Enter a new name :</label>
          <div className={styles.field}>
            <input
              id="title"
              placeholder="Enter text"
              defaultValue={text}
              {...register("text", {
                required: { value: true, message: "Please enter text" },
              })}
            />
            {errors.text && (
              <div className={styles.error_msg}>
                <i className="bx-error-circle"></i>
                <span>{errors.text.message}</span>
              </div>
            )}
          </div>
        </div>
        <div className={styles.submit_btn}>
          <button onClick={handleSubmit(({ text }) => onSubmit(text))}>
            Ok
          </button>
          <button onClick={toggle}>Cancel</button>
        </div>
      </div>
    </Modal>
  );
};

export default EditPopup;

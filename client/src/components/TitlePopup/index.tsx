import { useForm } from "react-hook-form";
import Modal from "@/components/Modal";

import styles from "./TitlePopup.module.scss";
import { useEffect } from "react";

type TitlePopupProps = {
  isOpen: boolean;
  title?: string;
  toggle: () => void;
  onSubmit: (value: string) => void;
};

const TitlePopup = ({ isOpen, title, toggle, onSubmit }: TitlePopupProps) => {
  let {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<{ title: string }>();

  useEffect(() => {
    if (isOpen) return;
    setValue("title", "");
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
              placeholder="Enter title"
              defaultValue={title}
              {...register("title", {
                required: { value: true, message: "Please enter title" },
              })}
            />
            {errors.title && (
              <div className={styles.error_msg}>
                <i className="bx-error-circle"></i>
                <span>{errors.title.message}</span>
              </div>
            )}
          </div>
        </div>
        <div className={styles.submit_btn}>
          <button onClick={handleSubmit(({ title }) => onSubmit(title))}>
            Ok
          </button>
          <button onClick={toggle}>Cancel</button>
        </div>
      </div>
    </Modal>
  );
};

export default TitlePopup;

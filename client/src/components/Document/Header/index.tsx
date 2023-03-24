import { Fragment, useMemo } from "react";
import DropDown from "@/components/DropDown";
import { getStaticUrl } from "@/utils";
import { User } from "@/types/User";

import styles from "./Header.module.scss";

type HeaderProps = {
  user?: User;
  logout: () => void;
  onClearFrame: () => void;
};

const Header = ({ user, logout, onClearFrame }: HeaderProps) => {
  let userInitial = useMemo(() => {
    if (!user) return "";
    let [firstName, lastName] = user.name.split(" ");
    return `${firstName.charAt(0)}${lastName ? lastName.charAt(0) : ""}`.trim();
  }, [user]);

  return (
    <Fragment>
      <div className={styles.header}>
        <div className={styles.logo}>
          <img src={getStaticUrl("/logo.png")} />
          <span>Google Jamboard</span>
        </div>
        <div className={styles.slides}>
          <button disabled>
            <i className="bx-chevron-left"></i>
          </button>
          <div className={styles.slide_count}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="46"
              height="36"
              viewBox="0 0 46 36"
            >
              <g fill="none">
                <rect
                  width="38"
                  height="22"
                  x="1"
                  y="7"
                  stroke="#3C4043"
                  strokeWidth="2"
                ></rect>
                <path
                  fill="#5F6368"
                  d="M8,4 L6,4 L6,0 L46,0 L46,24 L42,24 L42,22 L44,22 L44,2 L8,2 L8,4 Z"
                ></path>
                <polygon fill="#80868B" points="26 33 23 36 20 33"></polygon>
              </g>
            </svg>
            <span>1 / 2</span>
          </div>
          <button>
            <i className="bx-chevron-right"></i>
          </button>
        </div>
        <div
          id="user-dropdown"
          className={styles.avatar}
          data-letter={userInitial}
        ></div>
      </div>
      <div className={styles.toolbar}>
        <button className={styles.redo} disabled>
          <i className="bx-undo"></i>
        </button>
        <button className={styles.undo} disabled>
          <i className="bx-redo"></i>
        </button>
        <div className={styles.separator}></div>
        <button className={styles.zoom_out}>
          <i className="bx-zoom-out"></i>
        </button>
        <button className={styles.zoom_in}>
          <i className="bx-zoom-in"></i>
        </button>
        <div className={styles.separator}></div>
        <button className={styles.background_btn}>Set background</button>
        <div className={styles.separator}></div>
        <button className={styles.clear_btn} onClick={onClearFrame}>
          Clear frame
        </button>
      </div>
      <DropDown
        selector="#user-dropdown"
        placement="bottom-end"
        className={styles.dropdown}
      >
        <DropDown.Item onClick={logout}>
          <i className="bx-log-out"></i>
          <span>Logout</span>
        </DropDown.Item>
      </DropDown>
    </Fragment>
  );
};

export default Header;

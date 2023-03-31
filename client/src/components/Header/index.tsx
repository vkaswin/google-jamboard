import { Fragment, ReactNode, useMemo } from "react";
import DropDown from "@/components/DropDown";
import { getStaticUrl } from "@/utils";
import { User } from "@/types/User";

import styles from "./Header.module.scss";

type HeaderProps = {
  user?: User;
  title?: string;
  children: ReactNode;
  logout: () => void;
  toggleTitle: () => void;
};

const Header = ({
  user,
  title,
  children,
  logout,
  toggleTitle,
}: HeaderProps) => {
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
          <span onClick={toggleTitle}>{title}</span>
        </div>
        {children}
        <div
          id="user-dropdown"
          className={styles.avatar}
          data-letter={userInitial}
        ></div>
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

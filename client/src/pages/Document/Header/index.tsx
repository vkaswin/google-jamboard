import { Fragment, ReactNode } from "react";
import { Link } from "react-router-dom";
import Avatar from "@/components/Avatar";
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
  return (
    <Fragment>
      <div className={styles.header}>
        <div className={styles.logo}>
          <Link to="/document/list">
            <img src={getStaticUrl("/logo.png")} />
          </Link>
          <span onClick={toggleTitle}>{title}</span>
        </div>
        {children}
        <Avatar user={user} logout={logout} />
      </div>
    </Fragment>
  );
};

export default Header;

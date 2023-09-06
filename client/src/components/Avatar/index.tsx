import { Fragment, useMemo } from "react";
import DropDown from "@/components/DropDown";
import { User } from "@/types/User";

import styles from "./Avatar.module.scss";

type AvatarProps = {
  user?: User;
  logout: () => void;
};

const Avatar = ({ user, logout }: AvatarProps) => {
  let userInitial = useMemo(() => {
    if (!user) return "";
    let [firstName, lastName = ""] = user.name.split(" ");
    return `${firstName.charAt(0)}${lastName ? lastName.charAt(0) : ""}`.trim();
  }, [user]);

  return (
    <Fragment>
      <div
        id="user-dropdown"
        className={styles.container}
        data-letter={userInitial}
      ></div>
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

export default Avatar;

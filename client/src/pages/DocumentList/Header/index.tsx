import { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@/components/Avatar";
import { debounce, getStaticUrl } from "@/utils";
import { User } from "@/types/User";

import styles from "./Header.module.scss";

type HeaderProps = {
  search: string | null;
  user?: User;
  logout: () => void;
};

const Header = ({ search, user, logout }: HeaderProps) => {
  const navigate = useNavigate();

  const handleChange = debounce<ChangeEvent<HTMLInputElement>>(
    ({ target: { value } }) => {
      navigate({ search: value ? `?search=${value}` : "" });
    },
    500
  );

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <img src={getStaticUrl("/logo.png")} />
        <span>Google Jamboard</span>
      </div>
      <div className={styles.search_box}>
        <input
          placeholder="Search by title"
          defaultValue={search || ""}
          onChange={handleChange}
        />
        <i className="bx-search"></i>
      </div>
      <div className={styles.avatar}>
        <Avatar user={user} logout={logout} />
      </div>
    </div>
  );
};

export default Header;

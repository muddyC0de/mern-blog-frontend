import Link from "next/link";
import styles from "./Header.module.scss";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectIsAuth } from "@/redux/slices/auth";
export const Header = () => {
  const dispath = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  console.log(isAuth);
  const onClickLogout = () => {
    localStorage.setItem("token", "");
    dispath(logout());
  };

  return (
    <header className={styles.root}>
      <div className="container">
        <div className={styles.headerContent}>
          <Link href={"/"}>
            <div className={styles.logo}>MUDDY BLOG</div>
          </Link>
          <div className={styles.buttons}>
            {!isAuth ? (
              <>
                {" "}
                <Link href={"/login"}>
                  <Button variant="outlined">Вхід</Button>
                </Link>
                <Link href={"/signup"}>
                  <Button sx={{ color: "#ffff" }} variant="contained">
                    Створити аккаунт
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href={"/posts/create"}>
                  <Button variant="outlined">Написати статтю</Button>
                </Link>
                <Button
                  onClick={onClickLogout}
                  variant="contained"
                  color="error"
                >
                  Вийти
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

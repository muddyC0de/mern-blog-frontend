"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useForm } from "react-hook-form";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchRegister, selectIsAuth } from "@/redux/slices/auth";
import { useRouter } from "next/navigation";
import styles from "./Page.module.scss";
import axios from "../../axios";

type FormValues = {
  fullname: string;
  email: string;
  password: string;
};

export default function Signup() {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch<AppDispatch>();
  const [imageUrl, setImageUrl] = React.useState("");
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormValues>({ mode: "onChange" });
  const inputFileRef = React.useRef<HTMLInputElement>(null);
  const { replace } = useRouter();
  const handleChangeFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const formData = new FormData();
      const file = event.target.files ? event.target.files[0] : "";
      if (file) {
        formData.append("image", file);
      }
      const { data } = await axios.post("/upload", formData);
      setImageUrl(data.url);
    } catch (error) {
      console.error(error);
      alert("Ошибка при загрузке файла");
    }
  };

  const onSubmit = async (formData: {
    fullname: string;
    email: string;
    password: string;
  }) => {
    try {
      const { fullname, email, password } = formData;
      const data = await dispatch(
        fetchRegister({
          fullname,
          email,
          password,
          avatarUrl: imageUrl,
        })
      ).unwrap();
      localStorage.setItem("token", data.token);
    } catch (error: any) {
      console.error("Registration error:", error);
    }
  };
  if (isAuth) {
    replace("/");
  }
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          marginBottom: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography marginBottom={1} color="#fff" component="h1" variant="h5">
          Створення аккаунта
        </Typography>
        <img
          className={styles.avatar}
          width={100}
          height={100}
          src={
            imageUrl ? `http://localhost:4444${imageUrl}` : "/img/noavatar.png"
          }
          alt=""
        />
        <Button
          onClick={() => inputFileRef?.current?.click()}
          sx={{ marginTop: 2 }}
          variant="outlined"
        >
          Загрузити фото профілю
        </Button>
        <input
          ref={inputFileRef}
          type="file"
          onChange={handleChangeFile}
          hidden
        />
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            error={!!errors.fullname}
            {...register("fullname", {
              required: "Повне ім'я є обов'язковим",
              minLength: {
                value: 3,
                message: "Ім'я має складатись мінімум з 3 символів",
              },
            })}
            margin="normal"
            required
            fullWidth
            id="fullname"
            label="Повне ім'я"
            name="fullname"
            autoComplete="fullname"
            type="text"
            helperText={errors.fullname ? errors.fullname.message : ""}
            autoFocus
          />

          <TextField
            error={!!errors.email}
            {...register("email", {
              required: "E-mail є обов'язковим",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Некорректный формат email",
              },
            })}
            margin="normal"
            required
            fullWidth
            id="email"
            label="E-mail"
            name="email"
            type="email"
            helperText={errors.email ? errors.email.message : ""}
            autoComplete="email"
            autoFocus
          />

          <TextField
            error={!!errors.password}
            {...register("password", {
              required: "Пароль є обов'язковим",
              minLength: {
                value: 6,
                message: "Пароль повинен складатись мінімум з 6 символів",
              },
            })}
            margin="normal"
            required
            fullWidth
            name="password"
            label="Пароль"
            type="password"
            id="password"
            helperText={errors.password ? errors.password.message : ""}
            autoComplete="current-password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Зареєструватись
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/login" variant="body2">
                {"Вже є аккаунт? Вхід"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

"use client";

import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuth, selectIsAuth } from "@/redux/slices/auth";
import { AppDispatch } from "@/redux/store";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
type FormValues = {
  email: string;
  password: string;
};
export default function Login() {
  const { replace } = useRouter();
  const {
    register,
    formState: { errors },
    setError,
    handleSubmit,
  } = useForm<FormValues>({ mode: "onChange" });
  const dispatch = useDispatch<AppDispatch>();
  const isAuth = useSelector(selectIsAuth);
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const { email, password } = data;
      if (email && password) {
        const result = await dispatch(fetchAuth({ email, password })).unwrap();
        if (result && result.token) {
          localStorage.setItem("token", result.token);
        }
      }
    } catch (error: any) {
      if (error.type === "all") {
        setError("email", { message: "" });
        setError("password", { message: error.message });
      }

      if (error.type === "email") {
        setError("email", { message: error.message });
      }

      if (error.type === "password") {
        setError("password", { message: error.message });
      }
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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography color="#fff" component="h1" variant="h5">
          Вхід
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            error={!!errors.email}
            {...register("email", {
              required: "E-mail є обов'язковим",
            })}
            margin="normal"
            required
            fullWidth
            id="email"
            label="E-mail"
            name="email"
            autoComplete="email"
            helperText={errors.email ? errors.email.message : ""}
            autoFocus
          />

          <TextField
            error={!!errors.password}
            {...register("password", {
              required: "Пароль є обов'язковим",
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
            Увійти
          </Button>
          <Grid container>
            <Grid item>
              <Link href="signup" variant="body2">
                {"Ще немає аккаунта? Реєстрація"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

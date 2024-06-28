"use client";

import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../theme";
import { Provider, useDispatch, useSelector } from "react-redux";
import { AppDispatch, store } from "@/redux/store";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { Header } from "@/components/Header";
import React from "react";

import { fetchAuthMe, selectIsAuth } from "@/redux/slices/auth";

const ClientProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuth = useSelector(selectIsAuth);
  React.useEffect(() => {
    dispatch(fetchAuthMe());
  }, [dispatch]);

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <Header />
        <div className="container">{children}</div>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
};

export default ClientProviders;

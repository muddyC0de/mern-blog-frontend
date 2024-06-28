"use client";

import React from "react";
import styles from "./Sort.module.scss";
import { fetchPosts } from "@/redux/slices/posts";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
const sortOptions = [
  { title: "Нові", option: "createdAt" },
  { title: "Популярні", option: "viewsCount" },
];
export const Sort = () => {
  const [active, setActive] = React.useState(0);
  const dispatch = useDispatch<AppDispatch>();

  const onClickSort = (option: string, index: number) => {
    if (active !== index) {
      setActive(index);
      dispatch(fetchPosts(option));
    }
  };
  return (
    <ul className={styles.root}>
      {sortOptions.map((item: { title: string; option: string }, index) => (
        <li
          onClick={() => onClickSort(item.option, index)}
          className={index === active ? styles.active : ""}
          key={index}
        >
          {item.title}
        </li>
      ))}
    </ul>
  );
};

import React from "react";
import styles from "./ErrorBlock.module.scss";
type ErrorBlockProps = {
  title: string;
  imageUrl: string;
};

export const ErrorBlock: React.FC<ErrorBlockProps> = ({ title, imageUrl }) => {
  return (
    <div className={styles.root}>
      <img src={imageUrl} alt="" />
      <h1>{title}</h1>
    </div>
  );
};

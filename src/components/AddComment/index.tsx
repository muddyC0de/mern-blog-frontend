import React from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import axios from "../../axios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchComments, fetchCreateComment } from "@/redux/slices/comments";
import { useParams } from "next/navigation";
import { selectIsAuth } from "@/redux/slices/auth";

export const AddComment = () => {
  const [text, setText] = React.useState("");
  const isAuth = useSelector(selectIsAuth);
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { data } = useSelector((slice: RootState) => slice.authReducer);
  const onSend = () => {
    setText("");
    if (data?._id) {
      dispatch(fetchCreateComment({ text, postId: id, userId: data._id }));
    }
  };
  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src={`${process.env.NEXT_PUBLIC_API_URL}` + data?.avatarUrl}
        >
          {data?.fullname[0]}
        </Avatar>
        <div className={styles.form}>
          <TextField
            label="Написати коментар"
            value={text}
            onChange={(event) => setText(event.target.value)}
            variant="outlined"
            maxRows={10}
            multiline
            fullWidth
          />
          <Button
            disabled={isAuth ? false : true}
            onClick={onSend}
            sx={{ color: "#fff" }}
            variant="contained"
          >
            Відправити
          </Button>
        </div>
      </div>
    </>
  );
};

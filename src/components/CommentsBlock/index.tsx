import React from "react";

import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";
import styles from "./CommentsBlock.module.scss";
import { AddComment } from "../AddComment";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchComments } from "@/redux/slices/comments";
import { useParams } from "next/navigation";
import autoAnimate from "@formkit/auto-animate";
export const CommentsBlock = () => {
  const dispatch = useDispatch<AppDispatch>();
  const parent = React.useRef(null);
  const { comments, status } = useSelector(
    (state: RootState) => state.commentsReducer
  );
  const { data } = useSelector((state: RootState) => state.authReducer);
  const { id } = useParams();

  React.useEffect(() => {
    parent.current && autoAnimate(parent.current);
    dispatch(fetchComments(id));
  }, [dispatch, data]);
  return (
    <div className={styles.root}>
      <h6>Коментарі</h6>
      <List ref={parent}>
        {(status === "loading" ? [...Array(5)] : comments).map((obj, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                {status === "loading" ? (
                  <Skeleton variant="circular" width={40} height={40} />
                ) : (
                  <Avatar
                    alt="avatar"
                    src={
                      `${process.env.NEXT_PUBLIC_API_URL}` +
                      (data?._id === obj.user
                        ? data?.avatarUrl
                        : obj.user.avatarUrl)
                    }
                  >
                    {obj.user && obj.user.fullname
                      ? obj.user.fullname[0]
                      : data?.fullname[0]}
                  </Avatar>
                )}
              </ListItemAvatar>
              {status === "loading" ? (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Skeleton variant="text" height={25} width={120} />
                  <Skeleton variant="text" height={18} width={230} />
                </div>
              ) : (
                <ListItemText
                  primary={
                    data?._id === obj.user ? data?.fullname : obj.user.fullname
                  }
                  secondary={obj.text}
                />
              )}
            </ListItem>
          </React.Fragment>
        ))}
      </List>
      <AddComment />
    </div>
  );
};

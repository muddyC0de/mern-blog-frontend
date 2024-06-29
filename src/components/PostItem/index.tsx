import React from "react";
import styles from "./PostItem.module.scss";
import RemoveRedEyeSharpIcon from "@mui/icons-material/RemoveRedEyeSharp";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import ReactMarkdown from "react-markdown";
import EditIcon from "@mui/icons-material/Edit";
import { User } from "@/app/page";
import clsx from "clsx";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchRemovePost } from "@/redux/slices/posts";
import { AppDispatch, RootState } from "@/redux/store";
export type PostItemProps = {
  id: string;
  title: string;
  text: string;
  viewsCount: number;
  tags: string[];
  commentsLength?: number;
  imageUrl: string;
  createdAt: string;
  isFull?: boolean;
  user: User;
};

type Months = {
  [key: number]: string;
};
const months: Months = {
  0: "січня",
  1: "лютого",
  2: "березня",
  3: "квітня",
  4: "травня",
  5: "червня",
  6: "липня",
  7: "серпня",
  8: "вересня",
  9: "жовтня",
  10: "листопада",
  11: "грудня",
};

export const PostItem: React.FC<PostItemProps> = ({
  id,
  title,
  text,
  viewsCount,
  tags,
  commentsLength,
  user,
  imageUrl,
  createdAt,
  isFull,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data } = useSelector((state: RootState) => state.authReducer);
  const fullComments = useSelector(
    (state: RootState) => state.commentsReducer
  ).comments;
  const date = new Date(createdAt);
  const onClickRemove = () => {
    dispatch(fetchRemovePost(id));
  };

  return (
    <div className={clsx(styles.root, { [styles.rootFull]: isFull })}>
      {data?._id === user._id ? (
        <div className={styles.postBtns}>
          <Link href={`/posts/${id}/edit`}>
            {" "}
            <IconButton sx={{ color: "#3399ff" }} aria-label="clear">
              <EditIcon />
            </IconButton>
          </Link>
          <Link href={"/"}>
            {" "}
            <IconButton
              sx={{ color: "#ea2525" }}
              onClick={onClickRemove}
              aria-label="clear"
            >
              <ClearIcon />
            </IconButton>
          </Link>
        </div>
      ) : (
        ""
      )}

      {imageUrl ? (
        <div className={styles.img}>
          <img src={`${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`} alt="" />
        </div>
      ) : (
        ""
      )}

      <div className={styles.postWrapper}>
        <div className={styles.userInfo}>
          <img
            src={
              user.avatarUrl
                ? `${process.env.NEXT_PUBLIC_API_URL}${user.avatarUrl}`
                : "/img/noavatar.png"
            }
            alt=""
          />
          <div className={styles.userDetails}>
            <span className={styles.name}>{user.fullname}</span>
            <span className={styles.date}>{`${date.getDate()} ${
              months[date.getMonth()]
            } ${date.getFullYear()} р.`}</span>
          </div>
        </div>

        <div className={styles.postInfo}>
          {!isFull ? (
            <Link key={id} href={`/posts/${id}`}>
              <h2>{title}</h2>
            </Link>
          ) : (
            <h2>{title}</h2>
          )}

          <ul className={styles.tags}>
            {tags.map((tag, index) => (
              <Link key={index} href={`/posts/tags/${tag}`}>
                <li key={index}>#{tag}</li>
              </Link>
            ))}
          </ul>

          {isFull && <ReactMarkdown>{text}</ReactMarkdown>}
          <div className={styles.postStatsWrapper}>
            <div>
              <RemoveRedEyeSharpIcon /> <span>{viewsCount}</span>
            </div>
            <div>
              <ChatBubbleOutlineOutlinedIcon />{" "}
              <span>{isFull ? fullComments.length : commentsLength}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

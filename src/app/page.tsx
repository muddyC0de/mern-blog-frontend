"use client";

import { Sort } from "@/components/Sort";
import styles from "./Page.module.scss";
import { PostItem } from "@/components/PostItem";
import { TagsBlock } from "@/components/TagsBlock";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { AppDispatch, RootState } from "@/redux/store";
import { PostSkeleton } from "@/components/PostItem/PostSkeleton";
import { fetchPosts, fetchPostsWithTag } from "@/redux/slices/posts";
import { useParams } from "next/navigation";
import autoAnimate from "@formkit/auto-animate";
import { Comment } from "@/redux/slices/comments";
export type User = {
  avatarUrl: string;
  _id: string;
  fullname: string;
  email?: string;
  passwordHash?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Post = {
  _id: string;
  title: string;
  text: string;
  viewsCount: number;
  tags: string[];
  imageUrl: string;
  createdAt: string;
  comments: Comment[];
  user: User;
};

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const parent = React.useRef(null);
  const { tag } = useParams();
  const { posts, fetchGetStatus } = useSelector(
    (state: RootState) => state.postsReducer
  );
  React.useEffect(() => {
    parent.current && autoAnimate(parent.current);
    if (tag) {
      dispatch(fetchPostsWithTag(tag));
    } else {
      dispatch(fetchPosts("createdAt"));
    }
  }, [dispatch, tag]);

  return (
    <div className={styles.root}>
      <Sort />
      {tag && <h1 className={styles.tag}>#{tag}</h1>}
      <div className={styles.content}>
        <div ref={parent} className={styles.postItems}>
          {fetchGetStatus === "loaded"
            ? posts.map((post: Post) => (
                <PostItem
                  key={post._id}
                  id={post._id}
                  title={post.title}
                  text={post.text}
                  viewsCount={post.viewsCount}
                  tags={post.tags}
                  imageUrl={post.imageUrl}
                  createdAt={post.createdAt}
                  commentsLength={post.comments.length}
                  user={post.user}
                  isFull={false}
                />
              ))
            : Array(10)
                .fill(undefined)
                .map((_, index) => <PostSkeleton key={index} />)}
        </div>

        <TagsBlock />
      </div>
    </div>
  );
}

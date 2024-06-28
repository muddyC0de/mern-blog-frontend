"use client";

import { PostItem } from "@/components/PostItem";
import { useParams } from "next/navigation";
import axios from "../../../axios";
import React from "react";
import { Post } from "@/app/page";
import { PostSkeleton } from "@/components/PostItem/PostSkeleton";
import { CommentsBlock } from "@/components/CommentsBlock";
import autoAnimate from "@formkit/auto-animate";
import styles from "./Page.module.scss";

export default function FullPostPage() {
  const [fullPostData, setFullPostData] = React.useState<Post>({
    _id: "",
    title: "",
    text: "",
    viewsCount: 0,
    tags: [],
    imageUrl: "",
    createdAt: "",
    comments: [],
    user: {
      _id: "",
      email: "",
      passwordHash: "",
      createdAt: "",
      updatedAt: "",
      avatarUrl: "",
      fullname: "",
    },
  });
  const [isLoading, setIsLoading] = React.useState(true);
  const parent = React.useRef(null);
  const params = useParams<{ id: string }>();
  React.useEffect(() => {
    async function fetchPost() {
      setIsLoading(true);
      const { data } = await axios.get(`/posts/${params.id}`);
      setFullPostData(data);
      setIsLoading(false);
    }

    fetchPost();
  }, [params]);

  React.useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, []);
  return (
    <div className={styles.root} ref={parent}>
      {isLoading ? (
        <PostSkeleton />
      ) : (
        <PostItem
          id={fullPostData._id}
          title={fullPostData.title}
          imageUrl={fullPostData.imageUrl}
          user={fullPostData.user}
          createdAt={fullPostData.createdAt}
          viewsCount={fullPostData.viewsCount}
          tags={fullPostData.tags}
          text={fullPostData.text}
          isFull={true}
        />
      )}

      <CommentsBlock />
    </div>
  );
}

/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import dynamic from "next/dynamic";

import "easymde/dist/easymde.min.css";
import styles from "./Page.module.scss";
import axios from "../../../axios";
import { Button, Paper, TextField } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { AxiosResponse } from "axios";
import { Select } from "@/components/Select/Select";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchCreatePost, fetchEditPost } from "@/redux/slices/posts";
import { LoadingButton } from "@mui/lab";
import { Option } from "@/components/Select/Select";
import { selectIsAuth } from "@/redux/slices/auth";
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

interface PostData {
  title: string;
  text: string;
  imageUrl: string;
  tags: string[];
}

export default function CreatePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();
  const { replace } = useRouter();
  const [imageUrl, setImageUrl] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [tags, setTags] = React.useState<string[]>([]);
  const [selectOptions, setSelectOptions] = React.useState<Option[]>([]);
  const isAuth = useSelector(selectIsAuth);
  const [value, setValue] = React.useState("");
  const { fetchCreateStatus } = useSelector(
    (state: RootState) => state.postsReducer
  );
  const isEditing = Boolean(id);
  const inputFileRef = React.useRef<HTMLInputElement>(null);
  const onChange = React.useCallback((value: string) => {
    setValue(value);
  }, []);
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
      alert("Помилка при загрузці файлу");
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl("");
  };
  const onClickSubmit = async () => {
    const newTags = selectOptions.map((obj) => obj.value);
    const postInfo = {
      title,
      tags: newTags,
      text: value,
      imageUrl,
    };
    const data = isEditing
      ? await dispatch(fetchEditPost({ postInfo, id })).unwrap()
      : await dispatch(fetchCreatePost(postInfo)).unwrap();
    const _id = isEditing ? id : data._id;
    replace(`/posts/${_id}`);
  };
  const options = React.useMemo(() => {
    return {
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Введіть текст...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
        uniqueId: "CreatePageAutosave",
      },
    };
  }, []);
  React.useEffect(() => {
    if (id) {
      axios.get(`/posts/${id}`).then((res: AxiosResponse<PostData>) => {
        setTitle(res.data.title);
        setValue(res.data.text);
        setImageUrl(res.data.imageUrl);
        setTags(res.data.tags);
      });
    }
  }, []);

  if (!isAuth) {
    replace("/");
    return null;
  }
  return (
    <div className={styles.root}>
      {" "}
      <Paper style={{ padding: 30 }}>
        <Button
          sx={{ marginRight: "10px" }}
          onClick={() => inputFileRef?.current?.click()}
          variant="outlined"
          size="large"
        >
          Загрузити прев'ю
        </Button>
        <input
          ref={inputFileRef}
          type="file"
          onChange={handleChangeFile}
          hidden
        />
        {imageUrl && (
          <>
            {" "}
            <Button
              variant="contained"
              color="error"
              onClick={onClickRemoveImage}
            >
              Видалити
            </Button>
            <img
              className={styles.image}
              src={`${process.env.REACT_APP_API_URL}${imageUrl}`}
              alt="Uploaded"
            />
          </>
        )}
        <br />
        <br />
        <TextField
          classes={{ root: styles.title }}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          variant="standard"
          placeholder="Заголовок статті..."
          fullWidth
        />
        <Select
          tags={tags}
          setTags={setTags}
          selectOptions={selectOptions}
          setOptions={setSelectOptions}
        />
        <p className="secondary">- Введіть 3 теги</p>
        <SimpleMDE
          className={styles.editor}
          value={value}
          onChange={onChange}
          options={options}
        />
        <div className={styles.buttons}>
          <LoadingButton
            loading={fetchCreateStatus === "loading"}
            sx={{ color: "#ffff" }}
            onClick={onClickSubmit}
            disabled={
              selectOptions.length >= 3 &&
              title.length >= 3 &&
              value.length >= 10
                ? false
                : true
            }
            size="large"
            variant="contained"
          >
            {isEditing ? "Зберегти" : "Опублікувати"}
          </LoadingButton>
          <a href="/">
            <Button size="large">Відмінити</Button>
          </a>
        </div>
      </Paper>
    </div>
  );
}

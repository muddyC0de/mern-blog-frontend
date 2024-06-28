import React from "react";
import styles from "./TagsBlock.module.scss";
import TagIcon from "@mui/icons-material/Tag";
import axios from "../../axios";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import {
  TextField,
  ListItemButton,
  Skeleton,
  Box,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { ListItemText } from "@mui/material";
import { ListItemIcon } from "@mui/material";
import autoAnimate from "@formkit/auto-animate";
import debounce from "lodash.debounce";
type Tags = {
  tag: string;
  postsTagCount: number;
};

export const TagsBlock = () => {
  const [tags, setTags] = React.useState<Tags[]>([]);
  const [value, setValue] = React.useState("");
  const [searchValue, setSearchValue] = React.useState("");
  const parent = React.useRef(null);
  const fetchTags = async () => {
    if (!value) {
      const { data } = await axios.get("/tags/top");
      return setTags(data);
    }
    const { data } = await axios.get(`/tags/${value}`);
    return setTags(data);
  };
  const debouncedSetSearchValue = React.useCallback(
    debounce((value) => setSearchValue(value), 1000),
    []
  );

  const onChangeValue = (value: string) => {
    setValue(value);
    debouncedSetSearchValue(value);
  };

  React.useEffect(() => {
    parent.current && autoAnimate(parent.current);
    fetchTags();
  }, [searchValue]);

  return (
    <div className={styles.root}>
      <div className={styles.topBlock}>
        <h6>Популярні теги</h6>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <TextField
            id="outlined-basic"
            value={value}
            onChange={(event) => onChangeValue(event.target.value)}
            variant="outlined"
            placeholder="Введіть тег..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                width: "210px",
                height: "40px",
              },

              "& .MuiFormLabel-root": {
                top: "0",
              },
            }}
          />
        </Box>
      </div>
      <List ref={parent}>
        {tags.length > 0
          ? tags.map((tag, index) => {
              return (
                <a
                  key={index}
                  style={{ textDecoration: "none", color: "black" }}
                  href={`/posts/tags/${tag.tag}`}
                >
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <TagIcon />
                      </ListItemIcon>

                      <ListItemText primary={tag.tag} />
                      <div className={styles.count}>{tag.postsTagCount}</div>
                    </ListItemButton>
                  </ListItem>
                </a>
              );
            })
          : [...new Array(5)].map((_, index) => (
              <Skeleton
                sx={{ margin: "0 16px", marginBottom: "8px" }}
                key={index}
                variant="text"
                height={40}
              />
            ))}
      </List>
    </div>
  );
};

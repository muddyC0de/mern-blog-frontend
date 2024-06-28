import { body } from "express-validator";
export const loginValidation = [];

export const registerValidation = [
  body("email", "Неправильний формат пошти").isEmail(),
  body("password", "Пароль повинен складатись мінімум з 6 символів").isLength({
    min: 6,
  }),
  body("fullname", "Ім'я має складатись мінімум з 3 символів").isLength({
    min: 3,
  }),
  body("avatarUrl", "Невірне посилання на аватарку").optional(),
];

export const postCreateValidation = [
  body("title", "Введіть заголовок статті").isLength({ min: 3 }).isString(),
  body("text", "Введіть текст статті")
    .isLength({
      min: 10,
    })
    .isString(),
  body("tags", "Вкажіть хоча б один тег").isArray(),
  body("imageUrl", "Невірне посилання на зображення").optional().isString(),
];

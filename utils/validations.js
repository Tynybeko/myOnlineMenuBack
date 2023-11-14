import { body } from "express-validator";

export const register = [
    body('login', 'Логин должен содержать минимум 5 символов').isLength({min: 5}),
    body('password', 'Пароль должен быть не менее 6 символов').isLength({min: 6}),
]

export const changePassword = [
    body('password', 'Пароль должен быть не менее 6 символов').isLength({ min: 6 }),
]
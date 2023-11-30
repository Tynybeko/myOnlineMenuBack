import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from '../model/user.js';


export const register = async (req, res) => {
    try {
        const myPassword = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(myPassword, salt)

        const doc = new UserModel({
            login: req.body.login,
            password: hash,
            admin: req.body.admin
        })

        const user = await doc.save()
        const token = jwt.sign({
            _id: user._id,
        }, 'secretkeyforonlinemenu', {
            expiresIn: '30d',
        })

        const { password, ...userData } = user._doc;

        res.status(200).json({
            ...userData,
            token,
        })
    } catch (err) {
        res.status(500).json(err)
    }
}


export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ login: req.body.login });
        if (!user) {
            return res.status(403).json({
                error: 'Неверный логин или пароль'
            });
        }
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.password);

        if (!isValidPass) {
            return res.status(403).json({
                error: 'Неверный логин или пароль!'
            })
        }

        const token = jwt.sign({
            _id: user._id,
        }, 'secretkeyforonlinemenu', {
            expiresIn: '30d',
        })

        const { password, ...userData } = user._doc;


        res.json({
            ...userData,
            token,
        })


    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'Не удалось авторизоваться!'
        })
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                error: 'Пользователь не найден'
            })
        }
        const data = user._doc;
        const { password, ...someData } = data

        res.status(200).json({
            ...someData,
        })
    } catch (err) {
        res.status(400).json({
            error: 'Нету доступа'
        })
    }
}


export const refreshPass = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.password);
        if (!isValidPass) {
            return res.status(400).json({ error: 'Неправильный пароль!' })
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.newpassword, salt)
        await UserModel.findByIdAndUpdate(req.userId, {
            password: hash
        }).then(doc => {
            if (doc) {
                return res.status(200).json({ message: 'Пароль обнавлен' })
            } else {
                return res.status(400).json({ error: 'Произошла ошибка при обновлении' })
            }

        }).catch(err => {
            return res.status(400).json({ error: 'Произошла ошибка при обновлении' })

        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Произошла ошибка!' })
    }
}

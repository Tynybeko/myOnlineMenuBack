import CafeSchema from '../model/cafe.js'
import UserSchema from '../model/user.js'

export const createCafe = async (req, res) => {
    try {
        const user = await UserSchema.findById(req.userId)
        const curUser = await UserSchema.findById(req.body.userId)
        if (user && user.admin && curUser) {
            const cafe = new CafeSchema({
                title: req.body.title,
                userId: req.body.userId
            })
            await cafe.save()
            res.status(200).json({ message: "Добавлен", data: cafe })
        } else {
            res.status(400).json({ error: 'Нету доступа!' })
        }
    } catch (e) {
        res.status(500).json({ error: 'Произошла ошибка!' })
    }
}

export const updateCafe = async (req, res) => {
    try {
        const user = await UserSchema.findById(req.userId)
        if (user && user.admin) {
            await CafeSchema.findByIdAndUpdate(req.body.cafeId, {
                ...req.body
            }).then(async (data) => {
                res.status(200).json({ message: "Изменен", data })
            }).catch(e => {
                res.status(400).json({ error: 'Произошла ошибка при измении!' })
            })
        } else {
            res.status(400).json({ error: 'Нету доступа!' })
        }
    } catch (e) {
        res.status(500).json({ error: 'Произошла ошибка!' })
    }
}


export const deleteCafe = async (req, res) => {
    try {
        const user = await UserSchema.findById(req.userId)
        if (user && user.admin) {
            await CafeSchema.findByIdAndDelete(req.body.cafeId).then(async (data) => {
                res.status(200).json({ message: "Удален"})
            }).catch(e => {
                res.status(400).json({ error: 'Произошла ошибка при удалении!' })
            })
        } else {
            res.status(400).json({ error: 'Нету доступа!' })
        }
    } catch (e) {
        res.status(500).json({ error: 'Произошла ошибка!' })
    }
}


export const getCafe = async (req, res) => {
    try {
        const cafe = await CafeSchema.find({userId: req.userId})
        if (cafe) {
            res.status(200).json(cafe)
        } else {
            res.status(400).json({ error: 'Нету доступа!' })
        }
    } catch (e) {
        res.status(500).json({ error: 'Произошла ошибка!' })
    }
}
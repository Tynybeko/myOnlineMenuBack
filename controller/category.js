import CategorySchema from '../model/category.js'
import CafeSchema from '../model/cafe.js'
import FoodsSchema from '../model/food.js'


export const createCategory = async (req, res) => {
    try {
        const cafe = await CafeSchema.findById(req.body.cafeId)
        if (cafe && cafe.userId == req.userId) {
            const category = new CategorySchema({
                title: req.body.title,
                title_ky: req.body.title_ky ?? '',
                cafeId: cafe._id,
            })
            await category.save()
            res.status(201).json({ message: 'Добавлен', data: category })
        } else {
            res.status(400).json({ error: 'Не удалось найти или нету доступа!' })
        }
    } catch (e) {
        res.status(500).json({ error: 'Произошла ошибка', data: e })
    }

}

export const deleteCategory = async (req, res) => {
    try {
        await CategorySchema.findByIdAndDelete(req.params.catId)
            .then(del => {
                res.status(201).json({ message: 'Удален', data: del })
            }).catch(e => {
                res.status(400).json({ error: 'Не удалось найти или нету доступа!' })
            })
    } catch (e) {
        res.status(500).json({ error: 'Произошла ошибка', data: e })
    }

}



export const getCategoryAll = async (req, res) => {
    try {
        let categories = await CategorySchema.find({ cafeId: req.params.cafeId })
        res.status(200).json(categories)
    } catch (e) {
        res.status(500).json({ error: 'Произошла ошибка', data: e })
    }
}


export const getCategoryOne = async (req, res) => {
    try {
        const cat = await CategorySchema.findById(req.params.catId)
        if (cat) {
            const foods = await FoodsSchema.find({ catId: cat._id })
            res.status(200).json({ data: cat, values: foods })

        } else {
            res.status(400).json({ error: 'Не удалось найти или нету доступа!' })
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Произошла ошибка', data: e })
    }
}

export const updateCategory = async (req, res) => {
    try {
        const doc = await CategorySchema.findByIdAndUpdate(req.params.catId, {
            title: req.body.title,
            title_ky: req.body.title_ky ?? '',
            cafeId: req.body.cafeId
        }, { new: true })
        if (!doc) {
            res.status(400).json({ error: 'Не удалось изменить!' })
        }
        res.status(200).json({ message: 'Изменен!', data: doc })
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Произошла ошибка', data: e })
    }
}
import CategorySchema from '../model/category.js'
import CafeSchema from '../model/cafe.js'
import SubCategorySchema from '../model/subCat.js'
import FoodsSchema from '../model/food.js'


export const createSubCategory = async (req, res) => {
    try {
        const cat = await CategorySchema.findById(req.body.catId)
        if (cat) {
            const category = new SubCategorySchema({
                title: req.body.title,
                title_ky: req.body.title_ky ?? '',
                cafeId: req.body.cafeId,
                catId: cat._id,
            })
            cat.isDelete = false
            await cat.save()
            await category.save()
            res.status(201).json({ message: 'Добавлен', data: category })
        } else {
            res.status(400).json({ error: 'Не удалось найти или нету доступа!' })
        }
    } catch (e) {
        res.status(500).json({ error: 'Произошла ошибка', data: e })
    }

}

export const deleteSubCategory = async (req, res) => {
    try {
        await SubCategorySchema.findByIdAndDelete(req.params.catId)
            .then(async (del) => {
                let subCats = await SubCategorySchema.find({ catId: del.catId })
                if (!subCats.length) {
                    let cat = await CategorySchema.findById(del.catId)
                    cat.isDelete = true
                    cat.save()
                }
                res.status(201).json({ message: 'Удален', data: del })
            }).catch(e => {
                res.status(400).json({ error: 'Не удалось найти или нету доступа!' })
            })
    } catch (e) {
        res.status(500).json({ error: 'Произошла ошибка', data: e })
    }

}



export const getSubCategoryAll = async (req, res) => {
    try {
        let categories = await SubCategorySchema.find({ cafeId: req.params.cafeId })
        res.status(200).json(categories)
    } catch (e) {
        res.status(500).json({ error: 'Произошла ошибка', data: e })
    }
}


export const getAllSubCat = async (req, res) => {
    try {
        let categories = await SubCategorySchema.find({ catId: req.params.catId })
        let catIds = categories.map(item => item._id)
        let foods = await FoodsSchema.find({ catId: { $in: catIds } })
        let data = categories.map(item => ({ ...item._doc, value: foods.filter(el => el.catId == item._doc._id ? el._doc : null) }))
        res.status(200).json(data)
    } catch (e) {
        res.status(500).json({ error: 'Произошла ошибка', data: e })
    }
}



export const getSubCategoryAllCat = async (req, res) => {
    try {
        let categories = await SubCategorySchema.find({ catId: req.params.catId })
        res.status(200).json(categories)
    } catch (e) {
        res.status(500).json({ error: 'Произошла ошибка', data: e })
    }
}



export const getSubCategoryOne = async (req, res) => {
    try {
        const cat = await SubCategorySchema.findById(req.params.catId)
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

export const updateSubCategory = async (req, res) => {
    try {
        const doc = await SubCategorySchema.findByIdAndUpdate(req.params.catId, {
            ...req.body
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
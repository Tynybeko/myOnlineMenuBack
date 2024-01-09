import FoodSchema from '../model/food.js'
import CategorySchema from '../model/category.js'
import CafeSchema from '../model/cafe.js'
import SubCategorySchema from '../model/subCat.js'
import fs from 'fs'
import { dirname } from 'path'
import { fileURLToPath } from 'url';
import path from 'path'





const __filename = fileURLToPath(import.meta.url);
let __dirname = dirname(__filename);
__dirname = path.resolve(__dirname, '..')




export const createFood = async (req, res) => {
    try {
        const cat = await SubCategorySchema.findById(req.body.catId)
        if (cat) {
            const food = new FoodSchema({
                title: req.body.title,
                title_ky: req.body.title_ky ?? '',
                desc_ky: req.body.desc_ky ?? '',
                desc: req.body.desc,
                recipe_ky: req.body.recipe_ky,
                recipe: req.body.recipe,
                catTitle: cat.title,
                catId: req.body.catId,
                size: req.body.size,
                cafeId: req.body.cafeId,
                price: req.body.price,
                img: req.file ? `/uploads/${req.file.filename}` : ''
            })
            food.save()
            cat.isDelete = false
            cat.save()
            res.status(201).json({ message: 'Добавлен', data: food })
        } else {
            res.status(400).json({ error: 'Ошибка' })
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ errror: 'Возникли некоторые ошибки!' })
    }
}




export const getAllFood = async (req, res) => {
    try {
        let queryCond = {}
        const { page, limit, search, ...someQuery } = req.query
        for (let i in someQuery) {
            queryCond[i] = someQuery[i]
        }
        if (search) {
            const regex = new RegExp(search, 'i')
            queryCond = { ...queryCond, title: regex };
        }
        console.log(queryCond);
        const foods = await FoodSchema.find({ cafeId: req.params.cafeId, ...queryCond }).sort({ createdAt: -1 })
            .skip((((limit * page) - limit) || 0))
            .limit(limit ?? 20)
        res.status(200).json(foods)
    } catch (e) {
        res.status(500).json({ errror: 'Возникли некоторые ошибки!' })

    }
}


export const getAllFoodCat = async (req, res) => {
    try {
        const { search, cafeId } = req.query
        if (search) {
            const regex = new RegExp(search, 'i')
            let queryCond = { title: regex }
            if (cafeId) {
                queryCond = { ...queryCond, cafeId }
            }
            let searFoods = await FoodSchema.find({ ...queryCond })
            res.status(200).json(searFoods)
            return
        }
        const subCats = await SubCategorySchema.find({ catId: req.params.catId })
        let subCatsId = [...subCats.map(item => item._id), req.params.catId]
        const foods = await FoodSchema.find({ catId: { $in: subCatsId } }).sort({ createdAt: -1 })
        res.status(200).json(foods)
    } catch (e) {
        res.status(500).json({ errror: 'Возникли некоторые ошибки!' })

    }
}


export const deleteFood = async (req, res) => {
    try {
        await FoodSchema.findByIdAndDelete(req.params.foodId).then((async (food) => {

            let filePath = __dirname + food.img
            const foodsCafe = await FoodSchema.find({ catId: food.catId })
            if (!foodsCafe.length) {
                let cat = await SubCategorySchema.findById(food.catId)
                if (!cat) {
                    cat.isDelete = true
                    await cat.save()
                }
            }
            if (food.img) {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                        res.status(500).json({ error: 'Ошибка при удалении изоброжении!' });
                    }
                });
            }
            res.status(201).json({ message: 'Удален', data: food })
        }))
            .catch(e => {
                console.log(e);
                res.status(400).json({ error: 'Не удалось найти!' })
            })
    } catch (e) {
        console.log(e);
        res.status(500).json({ errror: 'Возникли некоторые ошибки!' })

    }
}


export const updateFood = async (req, res) => {
    try {
        let food = await FoodSchema.findById(req.params.foodId)
        if (!food) {
            res.status(400).json({ error: 'Не удалось найти блюдо!' })
        }

        if (req.file) {
            if (food.img) {
                let filePath = __dirname + food.img
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                        res.status(500).json({ error: 'Ошибка при удалении изоброжении!' });
                    }
                });
            }
            await FoodSchema.findByIdAndUpdate(food._id, {
                ...req.body,
                img: `/uploads/${req.file.filename}`
            }, { new: true }).then(newFood => {
                res.status(201).json({ message: 'Изменен', data: newFood })
            }).catch(err => {
                res.status(400).json({ error: 'Не удалось изменить блюдо!' })
            })
        } else {
            await FoodSchema.findByIdAndUpdate(food._id, {
                ...req.body,
            }, { new: true }).then(newFood => {
                res.status(201).json({ message: 'Изменен', data: newFood })
            }).catch(err => {
                res.status(400).json({ error: 'Не удалось изменить блюдо!' })
            })
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ errror: 'Возникли некоторые ошибки!' })
    }
}
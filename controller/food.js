import FoodSchema from '../model/food.js'
import CategorySchema from '../model/category.js'
import CafeSchema from '../model/cafe.js'
import fs from 'fs'
import { dirname } from 'path'
import { fileURLToPath } from 'url';
import path from 'path'
import { log } from 'console'






const __filename = fileURLToPath(import.meta.url);
let __dirname = dirname(__filename);
__dirname = path.resolve(__dirname, '..')




export const createFood = async (req, res) => {
    try {
        const cat = await CategorySchema.findById(req.body.catId)
        if (cat) {
            const food = new FoodSchema({
                title: req.body.title,
                desc: req.body.desc,
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
        const foods = await FoodSchema.find({ cafeId: req.params.cafeId, ...queryCond }).sort({ createdAt: -1 })
            .skip((((limit * page) - limit) || 0))
            .limit(limit ?? 20)


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
                let cat = await CategorySchema.findById(food.catId)
                if (cat) {
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
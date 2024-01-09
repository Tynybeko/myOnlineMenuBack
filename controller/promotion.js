import PromotionSchema from '../model/promotion.js'
import CafeSchema from '../model/cafe.js'
import fs from 'fs'
import { dirname } from 'path'
import { fileURLToPath } from 'url';
import path from 'path'
const __filename = fileURLToPath(import.meta.url);
let __dirname = dirname(__filename);
__dirname = path.resolve(__dirname, '..')


export const createPromotion = async (req, res) => {
    try {
        const cafe = await CafeSchema.findById(req.body.cafeId)
        if (cafe) {
            const promo = await new PromotionSchema({
                ...req.body,
                img: req.file ? `/uploads/${req.file.filename}` : '',
            })
            await promo.save()
            res.status(201).json(promo)
        } else {
            res.status(400).json({ error: 'Не удалось найти кафе!', })
        }
    } catch (e) {
        res.status(500).json({ error: 'Произошла ошибка', data: e })
    }
}



export const getAllPromo = async (req, res) => {
    try {
        const promos = await PromotionSchema.find({ cafeId: req.params.cafeId })
        res.status(200).json(promos)
    } catch (e) {
        res.status(500).json({ error: 'Произошла ошибка', data: e })
    }
}


export const updatePromo = async (req, res) => {
    try {
        const myPromo = await PromotionSchema.findById(req.params.promoId)
        if (myPromo) {
            if (!req.file) {
                await PromotionSchema.findByIdAndUpdate(myPromo._id, {
                    ...req.body
                }, { new: true }).then((doc) => {
                    res.status(201).json(doc)
                }).catch(e => {
                    res.status(400).json({ error: 'Произошла ошибка при изменении', data: e })
                })
            } else {
                let filePath = __dirname + myPromo.img
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                        res.status(500).json({ error: 'Ошибка при удалении изоброжении!' });
                        return
                    }
                });
                await PromotionSchema.findByIdAndUpdate(myPromo._id, {
                    ...req.body,
                    img: `/uploads/${req.file.filename}`,
                }, { new: true }).then((doc) => {
                    res.status(201).json(doc)
                }).catch(e => {
                    res.status(400).json({ error: 'Произошла ошибка при изменении', data: e })
                })
            }
        } else {
            res.status(400).json({ error: 'Не удалось найти Акции и Скидки' })
        }
    } catch (e) {
        res.status(500).json({ error: 'Произошла ошибка', data: e })
    }
}





export const deletePromo = async (req, res) => {
    try {
        await PromotionSchema.findByIdAndDelete(req.params.promoId).then(async (doc) => {
            if (doc.img) {
                let filePath = __dirname + doc.img
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                        res.status(500).json({ error: 'Ошибка при удалении изоброжении!' });
                        return
                    }
                });
            }
            res.status(201).json({ message: 'Успешно удален!' })
        }).catch(e => {
            res.status(400).json({ error: 'Произошло ошибка при удалении!', data: e })
        })
    } catch (e) {
        res.status(500).json({ error: 'Произошла ошибка', data: e })
    }
}
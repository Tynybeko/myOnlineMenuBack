import TableSchema from '../model/table.js'
import CafeSchema from '../model/cafe.js'

export const createTable = async (req, res) => {
    try {
        const cafe = await CafeSchema.findById(req.body.cafeId)
        if (!cafe) {
            res.status(400).json({ error: 'Не удалось найти кафе!' })
        }
        const table = new TableSchema({ title: req.body.title, cafeId: cafe._id})
        table.save()
        res.status(201).json({ message: 'Стол добавлен!', data: table })
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Произошла ошибка!', data: e })
    }
}


export const deleteTable = async (req, res) => {
    try {
        await TableSchema.findByIdAndDelete(req.params.tableId)
            .then(doc => {
                res.status(200).json({ message: 'Успешно удалено!', data: doc })
            })
            .catch(err => {
                res.status(400).json({ error: 'Не удалось удалить' })
            })
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Произошла ошибка!', data: e })
    }
}




export const getAllTables = async (req, res) => {
    try {
        const tables = await TableSchema.find({ cafeId: req.params.cafeId })
        res.status(200).json(tables)
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Произошла ошибка!', data: e })
    }
}
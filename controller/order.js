import Order from '../model/order.js'



export const createOrder = async (req, res) => {
    try {
        const order = new Order({
            items: req.body.items,
            table: req.body.table,
        })
        order.save()
        res.status(200).json({message: 'Заказ был отправлен!', data: order})
    } catch (e) {
        res.status(500).json({ error: 'Произошла ошибка!', data: e })
    }
}
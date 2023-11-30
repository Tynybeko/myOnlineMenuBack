import Order from '../model/order'



export const createOrder = async (req, res) => {
    try {
        const order = new Order({
            items: req.body.items,
            table: req.body.table,
            deliveryAddress: req.body.deliveryAddress
        })
        order.save()
    } catch (e) {
        res.status(500).json({ error: 'Произошла ошибка!', data: e })
    }
}
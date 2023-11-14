import jwt from 'jsonwebtoken'

export default async (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if (token) {
        try {
            const decoded = jwt.verify(token, 'secretkeyforonlinemenu')
            req.userId = decoded._id;
            next()
        } catch (err) {
            return res.status(401).json({
                error: 'ERROR'
            })
        }
    } else {
        return res.status(404).json({
            error: 'Нет доступа!!!'
        })
    }
}
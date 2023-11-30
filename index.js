import express, { json } from 'express'
import mongoose from 'mongoose';
import { checkAuth, handleValidationErrors } from './utils/utils.js'
import * as Validations from './utils/validations.js'
import { Users, Cafe, Category, Food, Table } from "./controller/index.js";
import cors from 'cors'
import multer from 'multer';


const uri = "mongodb+srv://tynybeko111222:myonlinemenu@onlinemenu.erzeyob.mongodb.net/test?retryWrites=true&w=majority";
const app = express();
app.use(express.json())
app.use(cors())
const PORT = 4433;



(async function () {
    try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => console.log("MONGO DB OK"))
            .catch((err) => console.log(err, "ERROR MONGO"))
        app.listen(PORT, () => {
            console.log('Server started on port', PORT);
        })
    } catch (err) {
        console.log(err, "NOT WORK");
    }
}())

app.use('/uploads', express.static('uploads'));
const storage = multer.diskStorage(
    {
        destination: (_, __, cb) => {
            cb(null, 'uploads')
        },
        filename: (_, file, cb) => {
            cb(null, Math.random() + file.originalname)
        },

    }
)

const upload = multer({ storage })




app.post('/auth/login', Users.login)
app.post('/auth/register', Validations.register, handleValidationErrors, Users.register)
app.get('/auth/me', checkAuth, Users.getMe)


app.post('/cafe/create', checkAuth, Cafe.createCafe)
app.patch('/cafe/update', checkAuth, Cafe.updateCafe)
app.delete('/cafe/delete', checkAuth, Cafe.deleteCafe)
app.get('/cafe', checkAuth, Cafe.getCafe)



app.post('/category/create', checkAuth, Category.createCategory)
app.get('/category/:catId', Category.getCategoryOne)
app.get('/categories/:cafeId', Category.getCategoryAll)
app.delete('/category/delete/:catId', checkAuth, Category.deleteCategory)
app.patch('/category/update/:catId', checkAuth, Category.updateCategory)


app.post('/food/create', checkAuth, upload.single('img'), Food.createFood)
app.get('/foods/:cafeId', Food.getAllFood)
app.delete('/food/delete/:foodId', checkAuth, Food.deleteFood)
app.patch('/food/update/:foodId', checkAuth, upload.single('img'), Food.updateFood)



app.post(`/table/create`, checkAuth, Table.createTable)
app.get(`/tables/:cafeId`, Table.getAllTables)
app.delete(`/table/delete/:tableId`, checkAuth, Table.deleteTable)
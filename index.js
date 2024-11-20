import express, { json } from 'express'
import mongoose from 'mongoose';
import { checkAuth, handleValidationErrors } from './utils/utils.js'
import * as Validations from './utils/validations.js'
import { Users, Cafe, Category, Food, Table, Order, SubCat, Promotion } from "./controller/index.js";
import cors from 'cors'
import multer from 'multer';

const mongoPass = process.env.MONGO_DB_PASS
const uri = `mongodb+srv://tynybeko111222:${mongoPass}@onlinemenu.erzeyob.mongodb.net/test?retryWrites=true&w=majority`;
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
            let name = String(Math.random()).slice(2)
            let fileName = file.originalname.split('_').join('')
            cb(null, name + fileName)
        },

    }
)

const upload = multer({ storage })


//  Пользователь


app.post('/auth/login', Users.login)
app.post('/auth/register', Validations.register, handleValidationErrors, Users.register)
app.get('/auth/me', checkAuth, Users.getMe)
app.get('/users', checkAuth, Users.getAllUsers)
app.get('/myPass/:userId', checkAuth, Users.getPassUser)
app.delete('/delete/user/:userId', checkAuth, Users.deleteUser)

//  Кафе

app.post('/cafe/create', checkAuth, Cafe.createCafe)
app.patch('/cafe/update', checkAuth, Cafe.updateCafe)
app.delete('/cafe/delete', checkAuth, Cafe.deleteCafe)
app.get('/cafe', checkAuth, Cafe.getCafe)
app.get('/cafe/:cafeId', Cafe.getOneCafe)
app.get('/cafes',checkAuth, Cafe.getAllCafe)
app.get('/cafes/all', Cafe.getAllCafes)

//  Категории


app.post('/category/create', checkAuth, Category.createCategory)
app.get('/category/:catId', Category.getCategoryOne)
app.get('/categories/:cafeId', Category.getCategoryAll)
app.delete('/category/delete/:catId', checkAuth, Category.deleteCategory)
app.patch('/category/update/:catId', checkAuth, Category.updateCategory)


// Под Категории


app.post('/subcategory/create', checkAuth, SubCat.createSubCategory)
app.get('/subcategory/:catId', SubCat.getSubCategoryOne)
app.get('/subcategories/:cafeId', SubCat.getSubCategoryAll)
app.get('/subcats/:catId', SubCat.getAllSubCat)
app.get('/subcategories/category/:catId', SubCat.getSubCategoryAllCat)
app.delete('/subcategory/delete/:catId', checkAuth, SubCat.deleteSubCategory)
app.patch('/subcategory/update/:catId', checkAuth, SubCat.updateSubCategory)


// Блюда



app.post('/food/create', checkAuth, upload.single('img'), Food.createFood)
app.get('/foods/:cafeId', Food.getAllFood)
app.get('/foods/category/:catId', Food.getAllFoodCat)
app.delete('/food/delete/:foodId', checkAuth, Food.deleteFood)
app.patch('/food/update/:foodId', checkAuth, upload.single('img'), Food.updateFood)

// Столы


app.post(`/table/create`, checkAuth, Table.createTable)
app.get(`/tables/:cafeId`, Table.getAllTables)
app.delete(`/table/delete/:tableId`, checkAuth, Table.deleteTable)

// Заказы

app.post('/order/create', Order.createOrder)


// Акции и Скидки

app.post('/create/promo', checkAuth, upload.single('img'), Promotion.createPromotion)
app.post('/promo/:cafeId', Promotion.getAllPromo)
app.patch('/update/promo/:promoId', checkAuth, upload.single('img'), Promotion.updatePromo)
app.delete('/delete/promo/:promoId', checkAuth, Promotion.deletePromo)

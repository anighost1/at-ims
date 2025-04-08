import express from 'express';
import cors from 'cors'
import mongoConnect from './config/mongodb.config.js';
import path from 'path'
import { fileURLToPath } from 'url';
import routeProtection from './middleware/routeProtection.js';

import authRoute from './routes/auth.route.js'
import categoryRoute from './routes/masterEntry/category.route.js'
import unitRoute from './routes/masterEntry/unit.route.js'
import storageRoute from './routes/masterEntry/storage.route.js'
import productRoute from './routes/masterEntry/product.route.js'
import inventoryRoute from './routes/masterEntry/inventory.route.js'


const app = express();
// eslint-disable-next-line no-undef
const port = process.env.PORT || 5555;

mongoConnect()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send('Welcome to AT IMS')
})

//auth route
app.use('/api/auth', authRoute)

app.use(routeProtection)

//master entry route
app.use('/api/master-entry/category', categoryRoute)
app.use('/api/master-entry/unit', unitRoute)
app.use('/api/master-entry/storage', storageRoute)
app.use('/api/master-entry/product', productRoute)
app.use('/api/master-entry/inventory', inventoryRoute)

app.listen(port, () => {
    console.log(`AT IMS server running at port : ${port}`);
});
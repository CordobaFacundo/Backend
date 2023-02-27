import express from 'express';
import ProductManager from './productManager.js';
import { validateProd } from './validateProd.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const manager = new ProductManager("./products.json");

//endpoints
app.get('/', (req, res) => {
    res.send(`
    <body>
        <h1>Welcome</h1>
    </body>`);
})

app.get('/products', async (req, res) => {
    const limit = req.query.limit;
    const products = await manager.getProducts();
    let response = products;
    if (limit && !isNaN(Number(limit))) {
        response = products.slice(0, limit);
    }
    res.send(response);
})

app.get('/products/:id', async (req, res) => {
    const prodId = req.params.id;
    const products = await manager.getProducts();
    const response = products.find((e) => e.id === Number(prodId));
    if (response) {
        res.send(response);
    } else {
        res.send(`
        <body>
            <h3>Error! Producto con id ${req.params.id} no existe!</h3>
        </body>`);
    }
})

app.post('/products', async (req, res) => {
    const newProd = req.body;
    const products = await manager.getProducts();
    const isValid =  await validateProd(newProd, products);
    if (isValid==true) {
        const id = await manager.addProducts(newProd);
        console.log(newProd);
        res.status(201).send({ id });
    }else {
        res.status(400).send({
            error: "datos invalidos",
        });
        return;
    }
})

const port = 8080;
app.listen(port, () => {
    console.log(`Servidor express escuchando en el puerto ${port}`);
})
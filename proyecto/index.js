import express from 'express';
import ProductManager from './productManager.js';

const app = express();
const manager = new ProductManager("./products.json");

//endpoints
app.get('/', (req, res) => {
    res.send(`
    <body>
        <h1>Welcome</h1>
    </body>`);
})

app.get('/products', async (req, res) => {
    const products = await manager.getProducts();
    const limit = req.query.limit;
    let response = products;
    if (limit && !isNaN(Number(limit))) {
        response = products.slice(0, limit);
    }
    res.send(response);
})

app.get('/products/:id', async (req, res) => {
    const products = await manager.getProducts();
    const prodId = req.params.id;
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

const port = 8080;
app.listen(port, () => {
    console.log(`Servidor express escuchando en el puerto ${port}`);
})
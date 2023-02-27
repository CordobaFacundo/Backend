import express from 'express';
import ProductManager from './productManager.js';
import { validateProd, validatePartialProd } from './validateProd.js';

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

app.post('/products', async (req, res) => {
    const newProd = req.body;
    const products = await manager.getProducts();
    const isValid = await validateProd(newProd, products);
    if (isValid) {
        const id = await manager.addProducts(newProd);
        res.status(201).send({ id });
    } else {
        res.status(400).send({
            error: "Invalid information",
        });
    }
})

app.get('/products/:id', async (req, res) => {
    const id = Number(req.params.id);
    const prodId = await manager.getProductById(id);
    if (!prodId) {
        res.status(404).send({ error: `Product with id ${id} not found.` });
        return;
    } else {
        res.send(prodId);
    }
})

app.put('/products/:id', async (req, res) => {
    const id = Number(req.params.id);
    const prodId = await manager.getProductById(id);
    if (!prodId) {
        res.status(404).send({ error: `Product with id ${id} not found.` });
        return;
    }
    const data = req.body;
    const products = await manager.getProducts();
    const isValid = await validateProd(data, products);
    if (isValid) {
        await manager.updateProduct(id, data)
        res.status(201).send({ ok: true });
    } else {
        res.status(400).send({
            error: "Invalid information",
        });
    }
})

app.patch('/products/:id', async (req, res) => {
    const id = Number(req.params.id);
    const prodId = await manager.getProductById(id);
    if (!prodId) {
        res.status(404).send({ error: `Product with id ${id} not found.` });
        return;
    }
    const newData = req.body;
    const isValid = validatePartialProd(newData)
    if (isValid) {
        await manager.updateProduct(id, newData);
        res.send({ ok: true });
    } else {
        res.status(400).send({
            error: 'Datos inválidos',
        })
    }
})

app.delete('/products/:id', async (req, res) => {
    const prodId = Number(req.params.id);
    const products = await manager.getProducts();
    const response = products.find((e) => e.id === prodId);
    if (response) {
        await manager.deleteProduct(prodId);
        res.send({ ok: 'true' });
    } else {
        res.status(404).send({ error: `Product with id ${prodId} not found.` });
    }
})

const port = 8080;
app.listen(port, () => {
    console.log(`Servidor express escuchando en el puerto ${port}`);
})
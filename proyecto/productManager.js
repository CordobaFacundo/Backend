import fs from 'fs'

export default class ProductManager {
    static products;
    id = 0;

    constructor(path) {
        this.path = path;
    }

    async addProducts(product) {
        this.products = await this.getProducts();
        this.id = this.products.length;

        if (!product.title || !product.description || !product.price || !product.stock) {
            console.log("Product information incomplete !");
        } else if (this.id === 0) {
            // this.pushProduct(product)
            this.id++;
            product = { ...product, id: this.id };
            const nuevos = [...this.products, product];
            const nuevosStr = JSON.stringify(nuevos);
            await fs.promises.writeFile(this.path, nuevosStr);
            console.log(`${product.title} - added to the list!`);
        } else {
            let searchCode = this.products.find((prod) => prod.code === product.code);
            if (searchCode) {
                console.error("Error! Repeated code.");
            } else {
                // this.pushProduct(product)
                this.id++;
                product = { ...product, id: this.id };
                const nuevos = [...this.products, product];
                const nuevosStr = JSON.stringify(nuevos);
                await fs.promises.writeFile(this.path, nuevosStr);
                console.log(`${product.title} - added to the list!`)
            }
        }
    }

    // async pushProduct(product) {
    //     this.id++;
    //     product = { ...product, id: this.id };
    //     const nuevos = [...this.products, product];
    //     const nuevosStr = JSON.stringify(nuevos);
    //     await fs.promises.writeFile(this.path, nuevosStr);
    //     console.log(`${product.title} - agregado a la lista`)
    // }

    async getProducts() {
        try {
            const data = await fs.promises.readFile(this.path);
            return JSON.parse(data);
        } catch (error) {
            console.error(error)
            return [];
        }
    }

    getProductById(id) {
        let prodForId = null;
        this.products.findIndex((prod) => {
            if (prod.id === id) {
                prodForId = prod;
            }
        });
        if (prodForId) {
            console.log("Product with id: " + id + " is " + prodForId.title);
        } else {
            console.log("Id not found!");
        }
    }

    async updateProducts(id, obj) {
        if (!obj.title || !obj.description || !obj.price || !obj.stock) {
            console.log("Product information to update incomplete!");
        } else {
            let searchCode = this.products.find((prod) => prod.code === obj.code);
            if (searchCode) {
                console.log("Error! Repeated code.");
            } else {
                const newProd = { ...obj, id: id }
                this.products[id - 1] = newProd;
                const prodStr = JSON.stringify(this.products);
                await fs.promises.writeFile(this.path, prodStr);
                console.log(`Product with id: ${id} updated.`);
            }
        }
    }

    async deleteProduct(id) {
        const removedProduct = { description: "Removed product.", id: id };
        this.products[id - 1] = removedProduct;
        const prodStr = JSON.stringify(this.products);
        await fs.promises.writeFile(this.path, prodStr);
        console.log(`Product with id: ${id} removed.`)
    }
}


//Productos a agregar
const product1 = { title: "ASUS NVIDIA GeForce RTX 3050", description: "GPU", price: 130000, thumbnail: "link", code: "ABC001", stock: 50 };
const product2 = { title: "Gigabyte NVIDIA GeForce RTX 3050", description: "GPU", price: 150000, thumbnail: "link", code: "ABC002", stock: 40 };
const product3 = { title: "Intel Core I3 10100F", description: "CPU", price: 30000, thumbnail: "link", code: "ABC003", stock: 65 };
const product4 = { thumbnail: "link", code: "ABC" };

async function main() {
    const manager = new ProductManager("./products.json");
    await manager.addProducts(product1);
    await manager.addProducts(product2);
    await manager.addProducts(product3);
    await manager.addProducts(product4);
    // await manager.deleteProduct(1);
    // await manager.updateProducts(1, { title: "Redragon Kumara K552", description: "Keyboard", price: 15000, thumnail: "link", code: "ABC000", stock: 70 });
    // manager.getProductById(2);
    const dataOnFile = await manager.getProducts();
    console.log(dataOnFile);
}
main();
import fs from 'fs'

export default class ProductManager {
    static products;
    id = 0;

    constructor(path) {
        this.path = path;
    }

    async addProducts(product) {
        this.products = await this.getProducts();
        this.id = this.products.length + 1;
        product = { ...product, id: this.id };
        const newp = [...this.products, product];
        const newStr = JSON.stringify(newp);
        await fs.promises.writeFile(this.path, newStr);
        console.log(`${product.title} - added to the list!`)
        return this.id;
    }

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

async function main() {
    const manager = new ProductManager("./products.json");
    // await manager.deleteProduct(1);
    // await manager.updateProducts(1, { title: "Redragon Kumara K552", description: "Keyboard", price: 15000, thumnail: "link", code: "ABC000", stock: 70 });
    // manager.getProductById(2);
    const dataOnFile = await manager.getProducts();
    console.log(dataOnFile);
}
main();
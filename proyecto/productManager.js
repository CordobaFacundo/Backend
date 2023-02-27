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

    async getProductById(id) {
        const array = await this.getProducts();
        const prodForId = array.find(
            (e) => e.id === id,
        );
        return prodForId;
    }

    async updateProduct(id, newData) {
        const prodId = await this.getProductById(id);
        if(!prodId) {
          throw new Error('Entidad no encontrada')
        }
        const array = await this.getProducts()
        const updatedProduct = {...prodId, ...newData};
        const arrayFiltered = array.filter(e => e.id !== id);
        const newArray = [...arrayFiltered, updatedProduct];
        const prodStr = JSON.stringify(newArray);
        await fs.promises.writeFile(this.path, prodStr);
        console.log(`Product with id: ${id} updated.`);
    }

    async deleteProduct(id) {
        const array = await this.getProducts()
        array[id - 1] = { description: "Removed product.", id: Number(id) };
        const prodStr = JSON.stringify(array);
        await fs.promises.writeFile(this.path, prodStr);
        console.log(`Product with id: ${id} removed.`)
    }
}

async function main() {
    const manager = new ProductManager("./products.json");
    const dataOnFile = await manager.getProducts();
    //console.log(dataOnFile);
}
main();
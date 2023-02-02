class ProductManager {
    static products;
    
    constructor() {
        this.products = [];
        this.id=0;
    }

    addProducts(product) {
        if(!product.title && !product.description && !product.price && !product.stock) {
            console.log("Informacion del producto incompleto!");
        }else {
            let searchCode = this.products.find((prod) => prod.code === product.code);
            if(searchCode) {
                console.log("Error! Codigo repetido.");
            }else {
                this.id++;
                product = {...product, id: this.id};
                this.products.push(product);
                console.log(`${product.title} - agregado a la lista!`);
            }
        }
    }

    getProducts() {
        if(this.products.length != 0) {
            console.log("PRODUCTOS: ", this.products);
        }else {
            console.log("No hay productos");
        }
        return this.products;
    }

    getProductById(id) {
        let prodForId = null;
        this.products.findIndex((prod) => {
            if(prod.id === id) {
                prodForId = prod;
            }
        });
        if(prodForId) {
            console.log("El producto con id " + id + " es " + prodForId.title);
        }else {
            console.log("Id not found");
        }
    }
}

const manager = new ProductManager();

//Productos a agregar
const product1 = { title: "ASUS NVIDIA GeForce RTX 3050", description: "Placa de video", price: 130000, thumbnail: "link", code: "ABC123", stock: 50 };
manager.addProducts(product1);

const product2 = { title: "Gigabyte NVIDIA GeForce RTX 3050", description: "Placa de video", price: 150000, thumbnail: "link", code: "ABC124", stock: 40 };
manager.addProducts(product2);

const product3 = { title: "Intel Core I3 10100F", description: "Procesador", price: 30000, thumbnail: "link", code: "ABC125", stock: 65 };
manager.addProducts(product3);

// //Producto con codigo repetido
const product4 = { title: "Intel Core I3 10100F", description: "Procesador", price: 30000, thumbnail: "link", code: "ABC125", stock: 65 };
manager.addProducts(product4);

// //Producto incompleto
const product5 = { thumbnail: "link", code: "ABC" };
manager.addProducts(product5);

//Muestra todos los productos añadidos
manager.getProducts();
manager.getProductById(2);
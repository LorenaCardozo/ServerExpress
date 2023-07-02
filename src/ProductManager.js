import fs from 'fs'
import { fileURLToPath } from "url";
import { dirname } from "path";



/********  CLASS -- PRODUCTO ***************/

class Producto {
    ID;
    title;
    description;
    price;
    thumbnail;
    code;
    stock;

    constructor(id, title, description, price, thumbnail, code, stock) {
        this.ID = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }

    camposCompletos() {
        if (this.ID === '' || this.ID === 'undefined' ||
            this.title === '' || this.title === 'undefined' ||
            this.description === '' || this.description === 'undefined' ||
            this.price === '' || this.price === 'undefined' ||
            this.thumbnail === '' || this.thumbnail === 'undefined' ||
            this.code === '' || this.code === 'undefined' ||
            this.stock === '' || this.stock === 'undefined'
        ) {
            return false;
        }

        return true;

    }
}

/********  CLASS -- FILE MANAGER ***************/

class FileManager {

    static async readFile(path) {
        try {
            if (fs.existsSync(path)) {
                let result = await fs.promises.readFile(path, "utf-8");

                let datos = result?await JSON.parse(result):[];
                return datos;
            }
        } catch (err) {
            console.log(err);
        }

    }

    static async writeFile(path, datos) {
        try {
            await fs.promises.writeFile(path, JSON.stringify(datos));
            return true;
        } catch (err) {
            console.log(err);
        }

    }

}

/********  CLASS -- PRODUCT MANAGER ***************/

export class ProductManager {
    products;
    static ultID = 0;

    constructor(path) {

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);

        this.path = __dirname + '/' + path
        this.products = [];
    }

    async addProduct(title, description, price, thumbnail, code, stock) {

        let productos = await FileManager.readFile(this.path);

        this.products = productos?.length > 0 ? productos : []

        if (this.products.some((p) => p.code === code)) {
            console.log(`Ya existe un producto con el Code ${code}`)
            return
        }

        ProductManager.ultID++;
        const prod = new Producto(ProductManager.ultID, title, description, price, thumbnail, code, stock);

        if (prod.camposCompletos()) {
            this.products.push(prod);
        }
        else {
            console.log('Debe completar todos los campos del producto')
        }

        //escribo el archivo

        try {
            await FileManager.writeFile(this.path, this.products);
        } catch (error) {
            console.log(error);
        }

    }

    async getProducts() {
        try {
            let productos = await FileManager.readFile(this.path);
            this.products = productos?.length > 0 ? productos : []

            return productos?.length > 0 ? productos : [];
        } catch (error) {
            console.log(error);
        }
    }

    async getProductById(id) {

        try {
            let productos = await FileManager.readFile(this.path);
            this.products = productos?.length > 0 ? productos : []

            const product = this.products.find((p) => p.ID === id)

            if (product !== undefined) {
                return product;
            } else {
                return "no se encontró el producto";
            }

        } catch (error) {
            console.log(error);
        }

    }

    async updateProduct(id, datos) {

        try {
            let productos = await FileManager.readFile(this.path);
            this.products = productos?.length > 0 ? productos : []

            const index = this.products.findIndex((p) => p.ID === id)

            if (index != -1) {
                delete datos.ID;

                this.products[index] = {
                    ...this.products[index],
                    ...datos,
                };

                await FileManager.writeFile(this.path, this.products);

                return "Se modificó el producto"

            } else {
                return "no se encontró el producto";
            }

        } catch (error) {
            console.log(error);
        }

    }

    async deleteProduct(id, datos) {

        try {
            let productos = await FileManager.readFile(this.path);
            this.products = productos?.length > 0 ? productos : []

            const index = this.products.findIndex((p) => p.ID === id)

            if (index != -1) {
                let product = this.products[index];
                this.products.splice(index, 1);

                await FileManager.writeFile(this.path, this.products);

                return "Se eliminó el producto."

            } else {
                return "no se encontró el producto";
            }

        } catch (error) {
            console.log(error);
        }

    }

}

export default {
    ProductManager
};

/*PRUEBA*/
/****************************************************/

/*
const pm = new ProductManager('./Productos.js');

pm.getProducts().then((p) => console.log(p))

pm.addProduct('producto prueba', 'Este es un producto prueba', 200, 'sin imagen', 'abc123', 25)
    .then(() => pm.getProducts().then((p) => console.log(p)))

*/

/****************************************************/


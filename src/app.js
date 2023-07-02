import express from 'express'
import {ProductManager} from './ProductManager.js';

const PUERTO = 8080

const app = express();
const productManager = new ProductManager('productos.json');

app.get("/", (req, res) =>{
    res.send("Holaaa!");
});

app.get("/products", async(req, res)=>{

    const { limit } = req.query;

    try{

        //productManager.getProducts().then((p) => {console.log(p); res.json(p)})
        let response = await productManager.getProducts();

        if(limit)
        {
            response = response.slice(0, limit);
        }

        res.json(response);

    }catch (error) {
        console.log("error", error);
    }
})

app.get("/products/:pid", async(req, res)=>{

    const { pid } = req.params;
    let response = await productManager.getProductById(parseInt(pid));

    res.json(response);
})

app.listen(PUERTO, ()=>{
    console.log("servidor esta corriendo en el puerto " + PUERTO);
})
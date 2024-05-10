const express = require("express")
const ProductManager = require("../recursos/ProductManager.js")
const { error } = require("console")
const router = express.Router()
const fs = require('fs').promises

let test2 = new ProductManager()

router.post("/", async (req, res) => {
    try{
        let products = req.body
        let carts = await fs.readFile("src/recursos/Carritos.json", 'utf-8')
        carts = JSON.parse(carts)
        let id = 1
        if(carts.length>0){
            id = carts[carts.length - 1].idCarrito + 1
        }
        carts.push({idCarrito:id, products:[products]})
        await fs.writeFile("src/recursos/Carritos.json", JSON.stringify(carts, null, "\t"))
        res.json({msg: "Carrito generado correctamente"})
    }catch(error){
        res.status(500).send("Se produjo un error: " + error)
    }
})

router.get("/:cid", async (req, res) => {
    try{
        const cid = parseInt(req.params.cid)
        let selectCart = await fs.readFile("src/recursos/Carritos.json", "utf-8")
        selectCart = JSON.parse(selectCart) 
        if(cid > selectCart.length){
            return res.json({msg: "No existe el carrito " + cid})
        }else{
            if(selectCart.length>0){
                let index = selectCart.findIndex(p=>p.idCarrito === cid)
                return res.json(selectCart[index])
            }
        }   
    }catch(error){
        res.status(500).send({msg: "Se produjo un error: " + error})
    }
    
})

router.post("/:cid/product/:pid", async (req, res) => {
    try{
        const cid = parseInt(req.params.cid)
        const pid = parseInt(req.params.pid)
        console.log(cid, pid)
        let carts = await fs.readFile("src/recursos/Carritos.json", 'utf-8')
        carts = JSON.parse(carts)
        let index = carts.findIndex(p=>p.idCarrito === cid)
        if(index===-1){
            return res.status(404).send("No existe el carrito seleccionado")
        }
        let product = await test2.getProductById(pid)
        if(product = error){
            return res.status(404).send("No existe el producto seleccionado")
        }
        const stock = product[0].cantidad
        console.log("stock: "+stock)
        carts[index].productos.push({id: pid,stock: stock})
        await fs.writeFile("src/recursos/Carritos.json", JSON.stringify(carts, null, "\t"))
        res.json({msg: "Carrito generado correctamente"})
    }catch(error){
        res.status(500).send({msg: "Se produjo un error: " + error})
    }
    
})

module.exports = router
const express = require("express")
const router = express.Router()
const ProductManager = require('../recursos/ProductManager.js')

const test1 = new ProductManager()

router.get("/", async (req, res) => {
    try{
        const allProducts = await test1.getProducts()
        console.log(allProducts)
        if(req.query.limit){
            if(req.query.limit > allProducts.length){
                res.send("Valor ingresado inexistente. No hay "+req.query.limit+" productos.")
                return
            }
            res.send(allProducts.slice(0, req.query.limit)) 
            return
        }
        res.send(allProducts) 
    }catch(error){
        res.status(500).send("Ocurrió un error al actualizar los datos: " + error)
    }
})

router.get("/:id", async (req, res) => {
    try{
        const idParam = parseInt(req.params.id) 
        console.log(idParam)
        const exists = await test1.getProductById(idParam) 
        if(!exists.length>0){
            res.status(404).send("No existe el producto")
            return
        }
        res.send(exists)
    }catch(error){
        res.status(500).send("Ocurrió un error al actualizar los datos: " + error)
    }
})

router.post("/", async (req, res) => {
    try{
        const {nombre, descrip, codigo, precio, cantidad,img} = req.body
        let rta = await test1.addProduct(nombre, descrip, precio, img, codigo, cantidad)
        res.json({message: rta})
    }catch(error){
        res.status(500).send("Ocurrió un error al actualizar los datos: " + error)
    }
})

router.put('/:pid', async (req,res) => {
    try{
        const idUpdate = parseInt(req.params.pid)
        const {valor, campo} = req.body
        let rta = await test1.updateProduct(idUpdate, campo, valor)
        res.json({message: rta})    
    }catch(error){
        res.status(500).send("Ocurrió un error al actualizar los datos: " + error)
    }
       
})

router.delete('/:pid', async (req,res) => {
    try{
        const idDelete = parseInt(req.params.pid)
        let rta = await test1.deleteProduct(idDelete)
        res.json({message: rta}) 
    }catch(error){
        res.status(500).send("Ocurrió un error al actualizar los datos: " + error)
    }    
})

module.exports = router

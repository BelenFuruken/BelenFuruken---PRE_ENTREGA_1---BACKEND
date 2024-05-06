const express = require("express")
const router = express.Router()
const ProductManager = require('../ProductManager.js')

const test1 = new ProductManager(__dirname+"/src/Productos.json")
//test1.addProduct('JAMON', 'FIAMBRE', 67, true, 222, 400)

router.get("/", async (req, res) => {
    try{
        const allProducts = await test1.getProducts()
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
        const idParam = parseInt(req.params.id) //porque el parametro es string
        console.log(idParam)
        const exists = await test1.getProductById(idParam) 
        if(!exists.length>0){
            res.status(404).send("No existe el producto")
            return
        }
        res.send(exists)
    }catch(error){
        console.log("Ocurrió un error al actualizar los datos: " + error)
    }
})

router.post("/", async (req, res) => {
    try{
        const {title, descrip, code, price, stock,thumbnails} = req.body
        //console.log(title, descrip, code, price, stock,thumbnails)
        let rta = await test1.addProduct(title, descrip, price, thumbnails, code, stock)
        res.json({message: rta})
    }catch(error){
        console.log("Ocurrió un error al actualizar los datos: " + error)
    }
})

router.put('/:pid', async (req,res) => {
    try{
        const idUpdate = parseInt(req.params.pid)
        const {valor, campo} = req.body
        //console.log(idUpdate, campo, valor)
        let rta = await test1.updateProduct(idUpdate, campo, valor)
        res.json({message: rta})    
    }catch(error){
        console.log("Ocurrió un error al actualizar los datos: " + error)
    }
       
})

router.delete('/:pid', async (req,res) => {
    try{
        const idDelete = parseInt(req.params.pid)
        let rta = await test1.deleteProduct(idDelete)
        res.json({message: rta}) 
    }catch(error){
        console.log("Ocurrió un error al actualizar los datos: " + error)
    }    
})

module.exports = router

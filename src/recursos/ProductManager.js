const { Console } = require('console')
const { propfind } = require('../routes/products.router')

const fs = require('fs').promises

class ProductManager{

    constructor(){
        this.path = "src/recursos/Productos.json"
    }

    async addProduct(title, description, price, thumbnail, code, stock){
        try{
            if(title === "" || description === "" || price === "" || thumbnail === "" || code === "" || stock ===""){
                return {message: "Debe ingresar todos los campos requeridos!"}
            } 
            let products = await this.getProducts() 
            let exists = products.find((p)=>p.codigo === code)
            if(exists){
                return {message: "Ya existe este codigo"}
            }else{
                let id = 1
                if(products.length>0){
                    id = products[products.length-1].id +1
                }
                products.push({
                    id: id,
                    nombre: title,
                    descrip: description,
                    precio: price,
                    img: thumbnail,
                    codigo: code,
                    cantidad: stock
                })
                await fs.writeFile(this.path, JSON.stringify(products, null, "\t"))
                return {message: "Producto agregado correctamente"}
            } 
        }catch(error){
            res.status(500).send("Ocurrió un error al agregar el producto: " + error)
        }     
    }

    async getProducts(){
        try {
            const products = await fs.readFile(this.path, 'utf-8')
            if(products.length>0){
                return JSON.parse(products)
            }
            return []

        }catch(error) {
            if (error.code === 'ENOENT') {
                return []
            } else {
                res.status(500).send(error)
            }
        }
    }

    async getProductById(idJoin){
        try{
            let products = await this.getProducts()
            if(products.length>0){
                let productSearch = products.filter(p => p.id === idJoin)
                if(productSearch.length>0){
                    return productSearch
                }else{
                return error("No existe el producto")
                }
            }
            return console.log("Todavía no hay nigún producto")
        }catch(error){
            res.status(500).send(error)
        }
    }

    async deleteProduct(idJoin){
        try{
        let products = await this.getProducts()
        let newList = products.filter(p => p.id !== idJoin)
        if(newList.length === products.length){
            return {msg: "No existe el id ingresado"}
        }
        await fs.writeFile(this.path, JSON.stringify(newList, null, "\t"))
        return {msg: "Producto eliminado correctamente"}
        }catch(eror){
            res.status(500).send("Ocurrió un error al borrar el producto: " + idJoin)
        }
    }

    async updateProduct(idActualizar, campoActualizar, nuevoValor){
        try{
        let products = await this.getProducts()
        console.log(products)
        let index = products.findIndex((p)=>p.id === idActualizar)
        if (index === -1){
            throw new Error("No existe el id seleccionado") 
        } 
        products[index][campoActualizar] = nuevoValor
        await fs.writeFile(this.path, JSON.stringify(products, null, "\t"))
        return {msg: "Producto actualizado correctamente"}
        }catch(error){
            res.status(500).send({msg: "Ocurrió un error al actualizar los datos: " + error})
        }
    }
}

module.exports = ProductManager
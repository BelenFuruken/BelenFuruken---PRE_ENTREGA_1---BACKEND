const express = require("express")
const path = require("path")
const app = express()
const productsRouter = require("./routes/products.router.js")
const cartsRouter = require("./routes/carts.router.js")


const PORT = 8080
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
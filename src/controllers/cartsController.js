import cartModel from "../models/cart.js"
import productModel from "../models/product.js"


export const getCart = async (req, res) => {
    try {
        const cartId = new mongoose.Types.ObjectId(req.params.cid)
        const cart = await cartModel.findById({_id: cartId})

        if (!cart) {
            return res.status(404).render("templates/error", {error: "Carrito no encontrado"})
        } else {
            res.status(200).render("templates/cart", {cart})
        }
    } catch (error) {
        console.log(error)
        res.status(500).render("templates/error", {error})
    }
}


export const createCart = async (req, res) => {
    try {
        const newCart = await cartModel.create({ products: [] })
        res.status(201).json({success: true, payload: newCart})
    } catch (error) {
        console.log(error)
        res.status(500).render("templates/error", {error})
    }
}


export const addProductToCart = async (req, res) => {
    try {
        const cartId = new mongoose.Types.ObjectId(req.params.cid)
        const productId = new mongoose.Types.ObjectId(req.params.pid) 
        const { quantity } = req.body

        if (!quantity || quantity <= 0) {
            return res.status(400).json({success: false, payload: "Cantidad no valida"})
        }

        const cartToUpdate = await cartModel.findOne({_id: cartId})
        const productToAdd = await productModel.findById({_id: productId})

        if (!cartToUpdate) {
            return res.status(404).json({success: false, payload: "Carrito no encontrado"})
        } 

        if (!productToAdd) {
            return res.status(404).json({success: false, payload: "Producto no encontrado"})
        }

        const productIndex = cartToUpdate.products.findIndex(prod => prod._id == productId)

        if (productIndex == -1) {
            cartToUpdate.products.push({ id_prod: productId, qty: quantity })
        } else {
            cartToUpdate.products[productIndex].qty = quantity
        }

        const updatedCart = await cartModel.findByIdAndUpdate(cartId, cartToUpdate, { new:true })

        res.status(200).json({success: true, payload: updatedCart})
    } catch (error) {
        console.log(error)
        res.status(500).render("templates/error", {error})
    }
}

export const updateProducts = async (req, res) => {
    try {
        const cartId = new mongoose.Types.ObjectId(req.params.cid)
        const { newProduct } = req.body
        const cartToUpdate = await cartModel.findOne({_id: cartId})
        cartToUpdate.products = newProduct
        cartToUpdate.save()

        res.status(200).json({success: true, payload: cartToUpdate})
    } catch (error) {
        console.log(error)
        res.status(500).render("templates/error", {error})
    }
}


export const updateProductQty = async (req, res) => {
    try {
        const cartId = new mongoose.Types.ObjectId(req.params.cid)
        const productId = new mongoose.Types.ObjectId(req.params.pid)
        const { quantity } = req.body

        if (!quantity || quantity <= 0) {
            return res.status(400).json({success: false, payload: "Cantidad inválida"})
        }

        const cartToUpdate = await productModel.findOne({_id: cartId})

        if (!cartToUpdate) {
            return res.status(404).json({success: false, payload: "Carrito no encontrado"})
        } 

        const productIndex = cartToUpdate.products.findIndex(prod => prod._id == productId)

        if (productIndex == -1) {
            return res.status(404).json({success: false, payload: "Producto no encontrado"})
        }

        cartToUpdate.products[productIndex].qty = quantity
        cartToUpdate.save()
        res.status(200).json({success: true, payload: cartToUpdate})
    } catch (error) {
        console.log(error)
        res.status(500).render("templates/error", {error})
    }
}

export const removeProduct = async (req, res) => {
    try {
        const cartId = new mongoose.Types.ObjectId(req.params.cid)
        const productId = new mongoose.Types.ObjectId(req.params.pid) 
        const cartToUpdate = await productModel.findOne({_id: cartId})

        if (!cartToUpdate) {
            return res.status(404).json({success: false, payload: "Carrito no encontrado"})
        } 

        const productIndex = cartToUpdate.products.findIndex(prod => prod._id == productId)

        if (productIndex == -1) {
            return res.status(404).json({success: false, payload: "Producto no encontrado"})
        }

        cartToUpdate.products.splice(productIndex, 1)
        cartToUpdate.save()
        res.status(200).json({success: true, payload: cartToUpdate})
    } catch (error) {
        console.log(error)
        res.status(500).render("templates/error", {error})
    }
}

export const emptyCart = async (req, res) => {
    try {
        const cartId = new mongoose.Types.ObjectId(req.params.cid)
        const cartToUpdate = await productModel.findOne({_id: cartId})

        if (!cartToUpdate) {
            return res.status(404).json({success: false, payload: "Carrito no encontrado"})
        } 

        cartToUpdate.products = []
        cartToUpdate.save()
        res.status(200).json({success: true, payload: cartToUpdate})
    } catch (error) {
        console.log(error)
        res.status(500).render("templates/error", {error})
    }
}
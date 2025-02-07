import { Router } from "express"
import { getCart, createCart, addProductToCart, updateProducts, updateProductQty, removeProduct, emptyCart } from "../controllers/cartsController.js"

const cartRouter = Router()

cartRouter.get("/:cid", getCart)
cartRouter.post("/", createCart)
cartRouter.post("/:cid/product/:pid", addProductToCart)
cartRouter.put("/:cid", updateProducts)
cartRouter.put("/:cid/product/:pid", updateProductQty)
cartRouter.delete("/:cid/product:pid", removeProduct)
cartRouter.delete("/:cid", emptyCart)

export default cartRouter
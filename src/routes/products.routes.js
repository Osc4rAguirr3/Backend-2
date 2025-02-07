import { Router } from "express"
import { getProducts, getProduct, addProduct, updateProduct, deleteProduct } from "../controllers/productsController.js"

const productRouter = Router()

productRouter.get("/", getProducts)
productRouter.get("/:pid", getProduct)
productRouter.post("/", addProduct)
productRouter.put("/:pid", updateProduct)
productRouter.delete("/:pid", deleteProduct)

export default productRouter
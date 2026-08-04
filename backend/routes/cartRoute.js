import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import { addToCart,deleteAllCart, getMyCart,removeCartItem,updateCartQuantity } from '../controllers/cartController.js'
import { cartValidation } from "../validations/cartValidation.js";
import validationMiddleware from "../middlewares/validationMiddleware.js";
import { updateCartValidation } from '../validations/updateCartValidation.js';


const cartRoute = express.Router()

cartRoute.post('/add',authMiddleware,cartValidation,validationMiddleware,addToCart)
cartRoute.get('/',authMiddleware,getMyCart)
cartRoute.put('/:id',authMiddleware,updateCartValidation,validationMiddleware,updateCartQuantity)
cartRoute.delete('/clear',authMiddleware,deleteAllCart)
cartRoute.delete('/:id',authMiddleware,removeCartItem)


export default cartRoute
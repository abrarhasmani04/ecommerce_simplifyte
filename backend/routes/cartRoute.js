import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import { addToCart,deleteAllCart, getMyCart,removeCartItem,updateCartQuantity } from '../controllers/cartController.js'

const cartRoute = express.Router()

cartRoute.post('/add',authMiddleware,addToCart)
cartRoute.get('/',authMiddleware,getMyCart)
cartRoute.put('/:id',authMiddleware,updateCartQuantity)
cartRoute.delete('/clear',authMiddleware,deleteAllCart)
cartRoute.delete('/:id',authMiddleware,removeCartItem)


export default cartRoute
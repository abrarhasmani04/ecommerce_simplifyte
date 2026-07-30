import express from 'express'
import { placeOrder,getMyOrders } from '../controllers/orderController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const orderRoute  = express.Router()

orderRoute.post('/',authMiddleware,placeOrder)
orderRoute.get("/my", authMiddleware, getMyOrders);

export default orderRoute
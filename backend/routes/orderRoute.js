import express from 'express'
import { placeOrder,getMyOrders,updateOrderStatus, cancelOrder,getSingleOrder, getAllOrders } from '../controllers/orderController.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import authorizeRoles from '../middlewares/authorizeRoles.js'
const orderRoute  = express.Router()

orderRoute.post('/',authMiddleware,placeOrder)
orderRoute.get("/my", authMiddleware, getMyOrders);
orderRoute.get('/:id',authMiddleware,getSingleOrder)
orderRoute.put("/:id/cancel",authMiddleware,cancelOrder)
orderRoute.get('/',authMiddleware,authorizeRoles("admin"),getAllOrders)
orderRoute.put('/:id/status',updateOrderStatus)

export default orderRoute
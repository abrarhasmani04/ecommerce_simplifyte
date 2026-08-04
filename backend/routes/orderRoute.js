import express from 'express'
import { placeOrder,getMyOrders,updateOrderStatus, cancelOrder,getSingleOrder, getAllOrders } from '../controllers/orderController.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import authorizeRoles from '../middlewares/authorizeRoles.js'
import { placeOrderValidation } from '../validations/orderValidation.js'

import { downloadInvoice } from '../controllers/invoiceController.js'
import validationMiddleware from '../middlewares/validationMiddleware.js'

const orderRoute  = express.Router()

orderRoute.post('/',authMiddleware,placeOrderValidation,validationMiddleware,placeOrder)
orderRoute.get("/my", authMiddleware, getMyOrders);
orderRoute.get('/:id',authMiddleware,getSingleOrder)
orderRoute.put("/:id/cancel",authMiddleware,cancelOrder)
orderRoute.get('/',authMiddleware,authorizeRoles("admin"),getAllOrders)
orderRoute.put('/:id/status',authMiddleware,authorizeRoles("admin"),updateOrderStatus)
orderRoute.get('/:id/invoice',authMiddleware,downloadInvoice)
export default orderRoute
import express from 'express'
import { createPaymentOrder, verifyPayment } from '../controllers/paymentController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const paymentRoute = express.Router()

paymentRoute.post('/create-order',authMiddleware,createPaymentOrder)
paymentRoute.post('/verify',authMiddleware,verifyPayment)



export default paymentRoute
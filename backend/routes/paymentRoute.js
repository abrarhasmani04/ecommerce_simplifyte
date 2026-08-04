import express from 'express'
import { createPaymentOrder, verifyPayment } from '../controllers/paymentController.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import { verifyPaymentValidation } from '../validations/verifyPaymentValidation.js'
import validationMiddleware from '../middlewares/validationMiddleware.js'

const paymentRoute = express.Router()

paymentRoute.post('/create-order',authMiddleware,createPaymentOrder)
paymentRoute.post('/verify',authMiddleware,verifyPaymentValidation,validationMiddleware,verifyPayment)



export default paymentRoute
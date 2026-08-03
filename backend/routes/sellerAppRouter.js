import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import { applySeller,getApplicationStatus,getSellerDashboard } from '../controllers/sellerController.js'
import authorizeRoles from '../middlewares/authorizeRoles.js'

const sellerAppRouter = express.Router()

sellerAppRouter.post('/apply',authMiddleware,applySeller)
sellerAppRouter.get('/application-status',authMiddleware,getApplicationStatus)
sellerAppRouter.get('/dashboard',authMiddleware,authorizeRoles('seller'),getSellerDashboard)
export default sellerAppRouter
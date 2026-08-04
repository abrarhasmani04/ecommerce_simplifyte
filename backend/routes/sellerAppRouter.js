import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import { applySeller,getApplicationStatus,getSellerDashboard,getSellerAnalytics ,updateSellerOrderStatus,getSellerProducts,getSellerOrders } from '../controllers/sellerController.js'
import authorizeRoles from '../middlewares/authorizeRoles.js'
import { sellerApplicationValidation } from '../validations/sellerValidation.js'
import validationMiddleware from '../middlewares/validationMiddleware.js'
const sellerAppRouter = express.Router()

sellerAppRouter.post('/apply',authMiddleware,sellerApplicationValidation,validationMiddleware,applySeller)
sellerAppRouter.get('/application-status',authMiddleware,getApplicationStatus)
sellerAppRouter.get('/dashboard',authMiddleware,authorizeRoles('seller'),getSellerDashboard)
sellerAppRouter.get('/products',authMiddleware,authorizeRoles('seller'),getSellerProducts)
sellerAppRouter.get("/orders",authMiddleware,authorizeRoles("seller"),getSellerOrders);
sellerAppRouter.put("/orders/:id/status",authMiddleware,authorizeRoles("seller"),updateSellerOrderStatus);
sellerAppRouter.get('/analytics',authMiddleware,authorizeRoles("seller"),getSellerAnalytics )
export default sellerAppRouter
import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import authorizeRoles from '../middlewares/authorizeRoles.js'
import { getDashboard ,getMonthlySales, getRecentOrders,getLowStock, getTopSellingProducts,getTopCategories} from '../controllers/adminController.js'
import {getSellerApplications, updateSellerApplication } from '../controllers/adminController.js'

const adminRoute = express.Router()

adminRoute.get('/dashboard',authMiddleware,authorizeRoles('admin'),getDashboard)
adminRoute.get('/recent-orders',authMiddleware,authorizeRoles('admin'),getRecentOrders)
adminRoute.get('/low-stock',authMiddleware,authorizeRoles("admin"),getLowStock)
adminRoute.get('/monthly-sales',authMiddleware,authorizeRoles("admin"),getMonthlySales)
adminRoute.get('/top-products',authMiddleware,authorizeRoles('admin'),getTopSellingProducts)
adminRoute.get("/top-categories",authMiddleware,authorizeRoles("admin"),getTopCategories);

adminRoute.get('/seller-applications', authMiddleware,authorizeRoles("admin"),getSellerApplications)
adminRoute.put("/seller-applications/:id",authMiddleware,authorizeRoles("admin"),updateSellerApplication);


export default adminRoute
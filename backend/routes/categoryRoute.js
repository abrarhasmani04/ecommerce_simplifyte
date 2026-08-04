import express from 'express'

import { addCategory,getCategories,getCategoryById,updateCategory,deleteCategory } from '../controllers/categoryController.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import authorizeRoles from '../middlewares/authorizeRoles.js'
import { categoryValidation } from "../validations/categoryValidation.js";
import validationMiddleware from "../middlewares/validationMiddleware.js";

const categoryRoute = express.Router()

categoryRoute.post('/category/',authMiddleware,categoryValidation,validationMiddleware,authorizeRoles('admin'),addCategory)
categoryRoute.get('/category/',getCategories)
categoryRoute.get('/category/:id',getCategoryById)
categoryRoute.put('/category/:id',authMiddleware,authorizeRoles("admin"),categoryValidation,validationMiddleware,updateCategory)
categoryRoute.delete('/category/:id',authMiddleware,authorizeRoles('admin'),deleteCategory)

export default categoryRoute
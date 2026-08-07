import express from 'express'

import { addProduct, getProducts, getProductById, updateProduct, deleteProduct } from '../controllers/productController.js'
import authMiddleware from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";
import upload from '../middlewares/MulterMiddleware.js';
import { productValidation } from "../validations/productValidation.js";
import validationMiddleware from "../middlewares/validationMiddleware.js";
import { updateProductValidation } from '../validations/updateProductValidation.js';

const productRoute = express.Router()

productRoute.get('/', getProducts)
productRoute.post('/add', authMiddleware, authorizeRoles('seller', 'admin'), upload.array('images', 5), productValidation, validationMiddleware, addProduct)
productRoute.get('/:id', getProductById)
productRoute.put('/:id', authMiddleware, authorizeRoles('seller', 'admin'), upload.array('images', 5), updateProductValidation, validationMiddleware, updateProduct)
productRoute.delete('/:id', authMiddleware, authorizeRoles('seller', 'admin'), deleteProduct)

export default productRoute

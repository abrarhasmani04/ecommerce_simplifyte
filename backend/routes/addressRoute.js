import express from 'express'
import { addAddress,deleteAddress, getMyAddresses, updateAddress } from '../controllers/addressController.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import { addressValidation } from "../validations/addressValidation.js";
import validationMiddleware from "../middlewares/validationMiddleware.js";

const addressRoute = express.Router()

addressRoute.post('/',authMiddleware,addressValidation,validationMiddleware,addAddress)
addressRoute.get('/',authMiddleware,getMyAddresses)
addressRoute.put('/:id',authMiddleware,addressValidation,validationMiddleware,updateAddress)
addressRoute.delete('/:id',authMiddleware,deleteAddress)

export default addressRoute
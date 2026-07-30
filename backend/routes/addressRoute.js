import express from 'express'
import { addAddress,deleteAddress, getMyAddresses, updateAddress } from '../controllers/addressController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const addressRoute = express.Router()

addressRoute.post('/',authMiddleware,addAddress)
addressRoute.get('/',authMiddleware,getMyAddresses)
addressRoute.put('/:id',authMiddleware,updateAddress)
addressRoute.delete('/:id',authMiddleware,deleteAddress)

export default addressRoute
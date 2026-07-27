import express from 'express'
import { loginUser, loginWithOTP,resetPassword ,registerUser,verifyEmail, verifyLoginOTP,forgotPassword } from '../controllers/authController.js'


const authRoute = express.Router()

authRoute.post('/user/register',registerUser)
authRoute.post('/user/login',loginUser)
authRoute.post('/user/verify-email',verifyEmail)
authRoute.post('/user/logout',()=>{})
authRoute.post('/user/login-with-otp',loginWithOTP)
authRoute.post('/user/verify-login-otp',verifyLoginOTP)
authRoute.post('/user/forgot-password',forgotPassword)
authRoute.post('/user/reset-password',resetPassword)
export default authRoute
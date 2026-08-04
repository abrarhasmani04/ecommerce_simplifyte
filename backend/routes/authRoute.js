import express from 'express'
import { loginUser, loginWithOTP,resetPassword ,getCurrentUser,registerUser,verifyEmail, verifyLoginOTP,forgotPassword, logoutUser } from '../controllers/authController.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import validationMiddleware from '../middlewares/validationMiddleware.js'
import { registerValidation } from '../validations/authValidation.js'
import authRateLimiter from '../middlewares/authRateLimiter.js'

const authRoute = express.Router()

authRoute.post('/user/register',registerValidation,validationMiddleware,registerUser)
authRoute.post('/user/login',authRateLimiter,loginUser)
authRoute.post('/user/verify-email',verifyEmail)
authRoute.post('/user/login-with-otp',loginWithOTP)
authRoute.post('/user/verify-login-otp',authRateLimiter,verifyLoginOTP)
authRoute.post('/user/forgot-password',authRateLimiter,forgotPassword)
authRoute.post('/user/reset-password',resetPassword)
authRoute.post('/user/logout',logoutUser)
authRoute.get("/user/me", authMiddleware, getCurrentUser);
export default authRoute
import express from 'express'
import { loginUser, loginWithOTP,resetPassword ,getCurrentUser,registerUser,verifyEmail, verifyLoginOTP,forgotPassword, logoutUser } from '../controllers/authController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const authRoute = express.Router()

authRoute.post('/user/register',registerUser)
authRoute.post('/user/login',loginUser)
authRoute.post('/user/verify-email',verifyEmail)
authRoute.post('/user/login-with-otp',loginWithOTP)
authRoute.post('/user/verify-login-otp',verifyLoginOTP)
authRoute.post('/user/forgot-password',forgotPassword)
authRoute.post('/user/reset-password',resetPassword)
authRoute.post('/user/logout',logoutUser)
authRoute.get("/user/me", authMiddleware, getCurrentUser);
export default authRoute
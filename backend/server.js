import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import categoryRoute from "./routes/categoryRoute.js";
import productRoute from "./routes/productRoute.js";
import path from "path";
import cartRoute from "./routes/cartRoute.js";
import addressRoute from "./routes/addressRoute.js";
import orderRoute from "./routes/orderRoute.js";
import paymentRoute from "./routes/paymentRoute.js";
import reviewRoute from "./routes/reviewRoute.js";
import wishlistRoute from "./routes/wishlistRoute.js";
import adminRoute from "./routes/adminRoute.js";
import sellerAppRoute from './routes/sellerAppRouter.js'
import helmet from 'helmet'
import rateLimiter from "./middlewares/rateLimiter.js";
import morgan from "morgan";
import compression from "compression";







dotenv.config();
const app = express();


connectDB();

app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);



app.use(express.json());
app.use(cookieParser());
app.use(compression())
app.use(morgan('dev'))

app.use(rateLimiter);


app.use("/api", authRoute);
app.use("/api",categoryRoute)
app.use('/api/product',productRoute)
app.use('/api/cart',cartRoute)
app.use('/api/address',addressRoute)
app.use('/api/orders',orderRoute)
app.use('/api/payment',paymentRoute)
app.use('/api/reviews',reviewRoute)
app.use('/api/wishlist',wishlistRoute)
app.use('/api/admin',adminRoute)
app.use('/api/seller',sellerAppRoute)

app.get("/", (req, res) => {
  res.send("helloww");
});





const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`);
});

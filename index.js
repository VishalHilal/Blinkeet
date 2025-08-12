import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import connectDB from './config/connectDB.js'
import userRouter from './route/userRoute.js'
import categoryRouter from './route/categoryRoute.js'
import uploadRouter from './route/uploadRouter.js'
import subCategoryRouter from './route/subCategoryRoute.js'
import productRouter from './route/productRoute.js'
import cartRouter from './route/cartRoute.js'
import addressRouter from './route/addressRoute.js'
import orderRouter from './route/orderRoute.js'


const app = express()


app.set("view engine","ejs")
app.use(cors({
    // origin:process.env.FRONTEND_URL,
    origin:"https://blinkeet-v1.vercel.app",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(
  "/api/order/webhook",
  express.raw({ type: "application/json" })
);

app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))
app.use(helmet({
    crossOriginResourcePolicy : false
}))

const PORT =process.env.PORT; 

app.get("/",(request,response)=>{
    ///server to client
    response.json({
        message : "Server is running " + PORT
    })
})



app.use('/api/user',userRouter)
app.use("/api/category",categoryRouter)
app.use("/api/file",uploadRouter)
app.use("/api/subcategory",subCategoryRouter)
app.use("/api/product",productRouter)
app.use("/api/cart",cartRouter)
app.use("/api/address",addressRouter)
app.use('/api/order',orderRouter)


app.get('/success', (req, res) => {
  const message = req.query.text || "Payment";
  res.render('success.ejs', { 
    text: message,
    frontendUrl:"https://blinkeet-v1.vercel.app"
  });
});

app.get('/cancel', (req, res) => {
  const message = req.query.text || "Payment";
  res.render('cancel.ejs', { 
    text: message,
    frontendUrl:"https://blinkeet-v1.vercel.app"
 });
});


connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("Server is running",PORT)
    })
})


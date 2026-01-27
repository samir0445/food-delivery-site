import express from "express"
import "dotenv/config"
import cookieParser from "cookie-parser"
import connectDB from "./config/db.js"
import userRoute from "./routes/auth.route.js"
import cors from "cors"
import user2Route from "./routes/user.route.js"
import shopRoute from "./routes/shop.route.js"
import itemRoute from "./routes/item.route.js"

const app = express()

// global middleware
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use(express.json())
app.use(cookieParser())
//  cooki

app.use("/api/auth" , userRoute);
app.use("/api/user" , user2Route);
app.use("/api/shop" , shopRoute);
app.use("/api/item" , itemRoute);



app.listen(process.env.PORT || 3000,async ()=>{
    await connectDB();
    console.log(`server started ${process.env.PORT}`);
    
})
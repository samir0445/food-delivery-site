import mongoose from "mongoose"
import "dotenv/config"


const  connectDB =async ()=>{
    try {
         await mongoose.connect(`${process.env.MONGODB}/kingo`);

         console.log("db connected");
         
    } catch (error) {
        console.log(error); 
    }

}
export default connectDB;

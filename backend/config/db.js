import mongoose from "mongoose"
import "dotenv/config"


const  connectDB =async ()=>{
    try {
         await mongoose.connect(`${process.env.MONGODB}/jingo`);

         console.log("db connected");
         
    } catch (error) {
        console.log(error); 
    }

}
export default connectDB;

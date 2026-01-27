import { v2 as cloudinary } from 'cloudinary'
import fs from "fs";
import "dotenv/config"

const uploadOnCloudinary = async (file)=> {
    cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
     api_key: process.env.CLOUDINARY_API_KEY, 
     api_secret:process.env.CLOUDINARY_SECRET_KEY
    });
    try {
        const result = await cloudinary.uploader.upload(file);// retunr object from which we get secure url
        fs.unlinkSync(file)// to delete file from local system.
        return result.secure_url;


    } catch (error) {
        fs.unlinkSync(file);
        console.log(error);  
    }
    
}

export default uploadOnCloudinary;
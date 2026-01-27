import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../util/cloudinary.js";

export const createShop = async(req,res)=>{
    try {
       
        
        const {name,city,state,address}=req.body;
        let image;
        if(req.file){
            
            
            
            image =await uploadOnCloudinary(req.file.path)
        }
        let shop = await Shop.findOne({owner:req.userId});
        
        if(!shop){
            shop = await Shop.create({
            name,
            city,
            state,
            address,
            image,
            owner :req.userId,

        })

        }else{
            shop = await Shop.findByIdAndUpdate(shop._id,{
            name,
            city,
            state,
            address,
            image,
            owner :req.userId,

        },{new:true})
        }

        await shop.populate("owner").populate({
                path:"items",
                option:{sort:{updatedAt:-1}}
            })
        return res.status(201).json(shop)
    } catch (error) {
        return res.status(500).json({place :" create shop" ,message : error.message })
    }

}



export const getMyShop = async(req,res)=>{
    try {
        const shop = await Shop.findOne({owner:req.userId}).populate("owner").populate({
                path:"items",
                option:{sort:{updatedAt:-1}}
            });
       
        
        if(!shop){
            return null;
        }
        return res.status(200).json(shop)
    } catch (error) {
        return res.status(500).json({place :" get shop" ,message : error.message })
    }

} 

export const getShopByCity = async(req,res)=>{
    try {
        const {city} = req.params;
        const shops = await Shop.find({
            city:{$regex:new RegExp(`^${city}$`,"i")} 
            // to find city without having case sensitive problem
        }).populate("items")

        if(!shops){
            return res.status(400).json({ message : "No shop Found"})
        }
        
        return res.status(200).json(shops)
    } catch (error) {
         return res.status(500).json({place :" get city shop" ,message : error.message })
    }
}
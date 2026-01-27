import jwt from "jsonwebtoken";
import "dotenv/config"

const genToken = async (userId)=>{

    try {
        const token = await jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "3d" })
        return token;
        
    } catch (error) {
        console.log("token gen error");
    }

}

export default genToken;
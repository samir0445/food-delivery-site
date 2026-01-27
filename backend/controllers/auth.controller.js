import "dotenv/config";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import genToken from "../util/token.js";
import { sendOtpMail } from "../util/nodemailer.js";

export const signUp = async (req, res) => {
   try {
      const { fullName, email, mobile, password, role } = req.body;
      let user = await User.findOne({ email })
      if (user) {
         return res.status(400).json({ message: "USer already exist" });
      }
      if (password.length < 8) {
         return res.status(400).json({ message: "password must be atleast 8 character" });
      }
      if (mobile.length < 10) {
         return res.status(400).json({ message: "mobile must have 10 digits" });
      }

      const hashed = await bcrypt.hash(password, 10);

      user = await User.create({
         fullName,
         email,
         mobile,
         password: hashed,
         role
      })
      
      
      const token = await genToken(user._id);
    
      

      res.cookie("token", token, {
         secure: false,
         sameSite: "strict",
         maxAge: 3 * 24 * 60 * 60 * 1000,
         httpOnly: true,
      })
       

      return res.status(201).json(user)


   } catch (error) {
      res.status(500).json({ place: "signup", message: error.message })


   }



}
export const signIn = async (req, res) => {
   try {
      const { email, password } = req.body;
      const user = await User.findOne({ email })
      if (!user) {
         return res.status(400).json({ message: "USer doesnot exist" });
      }
      if (password.length < 8) {
         return res.status(400).json({ message: "password must be atleast 8 character" });
      }
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
         return res.status(400).json({ message: "password inccorect" });
      }

      const token = await genToken(user._id);

      res.cookie("token", token, {
         secure: false,
         sameSite: "strict",
         maxAge: 3 * 24 * 60 * 60 * 1000,
         httpOnly: true
      })

      return res.status(200).json(user)


   } catch (error) {
      res.status(500).json({ place: "signin", message: error.message })


   }



}

export const signOut = async (req, res) => {
   try {
      res.clearCookie("token")
      return res.status(200).json({ message: "signout successfully" });
   } catch (error) {
      return res.status(500).json({ message: "signout error" });

   }
}

export const sendOtp = async (req, res) => {
   try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
         return res.status(400).json({ message: "USer doesnot exist" });
      }
      const otp = Math.floor(1000 + Math.random() *9000).toString()

      user.resetOtp = otp;
      user.otpExpires = Date.now() + 5*60*1000;

      await user.save();
      await sendOtpMail(email,otp);

      return res.status(200).json({ message:"otp send Successfully"})




   } catch (error) {
      res.status(500).json({ place: "sendotp", message: error.message })

   }

}

export const verifyOtp =async(req,res)=>{
   try {
      const { email ,otp } = req.body;
      const user = await User.findOne({email});

      if(!user || user.resetOtp != otp || user.otpExpires<Date.now())
         {
            return res.status(400).json({message:"invalid/expire otp"})

      }
      user.isOtpVerified= true;
      user.otpExpires = undefined;
      await user.save();

      return res.status(200).json({ message:"otp verified Successfully"})



   } catch (error) {
      res.status(500).json({ place: "verifyOtp", message: error.message })
      
   }
}

export const resetPassword = async(req,res)=> {
   try {
      const {email , newPassword} = req.body;

      const user = await User.findOne({ email })
      if (!user && !isOtpVerified) {
         return res.status(400).json({ message: "User does not exist or otp is not verified yet" });
      }
      const hashed = await bcrypt.hash(newPassword,10)
      user.password = hashed;

      return res.status(200).json({message:"password change successfully"})
      
   } catch (error) {
      res.status(500).json({ place: "resetPassword", message: error.message })
      
   }
   
}


// make it like common for signin and signup
export const googleAuth = async(req , res)=>{
   try {
      const {fullName,email,mobile,role} = req.body;
      let userr = await User.findOne({ email });

      if(!userr){
         userr = await User.create({
            fullName,
            mobile,
            email,
            role
         })
      }

      const token = await genToken(userr._id);

      res.cookie("token", token, {
         secure: false,
         sameSite: "strict",
         maxAge: 3 * 24 * 60 * 60 * 1000,
         httpOnly: true
      })


      return res.status(200).json(userr)

   } catch (error) {
      return res.status(500).json(`google auth ${error}`)
      
   }
}
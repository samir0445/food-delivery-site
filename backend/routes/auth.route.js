import express from "express";
import { googleAuth, resetPassword, sendOtp, signIn, signOut, signUp, verifyOtp } from "../controllers/auth.controller.js";

const userRoute = express.Router();

userRoute.post("/signup",signUp)
userRoute.post("/signin",signIn)
userRoute.get("/signout",signOut)
userRoute.post("/send-otp",sendOtp)
userRoute.post("/verify-otp",verifyOtp)
userRoute.post("/reset-password",resetPassword)
userRoute.post("/google-auth",googleAuth)

export default userRoute;

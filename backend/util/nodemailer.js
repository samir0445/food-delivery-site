
import nodemailer from "nodemailer";
import "dotenv/config";

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    host : 'smtp-relay.brevo.com',
    port : 587,
    secure: false,
     auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOtpMail =async(to,otp)=>{
    await transporter.sendMail({
        from:process.env.EMAIL,
        to,
        subject:"OTP FOR RESET PASSWORD",
        html:`<P>Your OTP for reset password is <b>${otp}</b>. It expires in 5 minute.</p>`
    })

}
export const sendDelievryOtp =async(user,otp)=>{
    await transporter.sendMail({
        from:process.env.EMAIL,
        to:user.email,
        subject:"Delievery Otp",
        html:`<P>Your OTP for making delivery is <b>${otp}</b>. It expires in 5 minute.</p>`
    })

}
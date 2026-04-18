import userModel from "../../../DB/Model/user.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { sendEmail } from "../../../Utils/Email/Email.js";
import stripe  from "../../../Utils/Stripe/stripe.js";
import dotenv from 'dotenv';
dotenv.config();


export const confirmEmail = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(400).json({ message: "authorization is required" });
        }

        const decoded = jwt.verify(authorization, process.env.TOKEN_SIGNATURE);

        if (!decoded?.email) {
            return res.status(400).json({ message: "In-valid token payload" });
        }
        const updateUser=await userModel.findOneAndUpdate({email:decoded.email},{isEmailVerified:true},{new:true})

        return res.status(200).json({ message: "ConfirmEmail",user:updateUser })
    } catch (error) {
        return res.status(500).json({ message: "Server Error", msg: error.message, stack: error })
    }
}

// export const signUp = async (req, res, next) => {
//     try {
//         const { userName, email, PassWord} = req.body;
//         const checkUser = await userModel.findOne({ email: email })
//         if (checkUser) {
//             res.status(403).send({ msg: "user already exist" })
//         }
//         const hashPass = await bcrypt.hash(PassWord, 10)

//         const customer = await stripe.customers.create(
//       {
//         email,
//       },
//       {
//         apiKey: process.env.STRIPE_SECRET_KEY,
//       }
//     );


//         const user = await userModel.create({ userName: userName, email: email, PassWord: hashPass,StripeId:customer.id })
//         const token = jwt.sign({ email: user.email, id: user._id }, process.env.TOKEN_SIGNATURE, { expiresIn: '1h' })


//         const Email_token = jwt.sign({ email: user.email }, process.env.TOKEN_SIGNATURE, { expiresIn: '1h' })
//         const emailLink = `${process.env.FE_URL}/confirm-email/${Email_token}`;
//         const html = `<a href='${emailLink}'>Click me</a>`;
//         await sendEmail({ to: email, subject: "confirmEmail", html }).catch((err)=>{
//             return res.status(400).json({msg:"Verification email error",err:err.message})
//         }
//         );


//         return res.status(200).json({ message: "signup", token: token, user })
//     } catch (error) {
//         return res.status(500).json({ message: "Server Error", msg: error.message, stack: error })
//     }
// }
export const signUp = async (req, res, next) => {
  try {
    const { userName, email, PassWord } = req.body;

    const checkUser = await userModel.findOne({ email });
    if (checkUser) {
      return res.status(403).send({ msg: "User already exists" }); 
    }

    const hashPass = await bcrypt.hash(PassWord, 10);

    const customer = await stripe.customers.create(
      { email },
      { apiKey: process.env.STRIPE_SECRET_KEY }
    );

    const user = await userModel.create({
      userName,
      email,
      PassWord: hashPass,
      StripeId: customer.id,
    });

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.TOKEN_SIGNATURE,
      { expiresIn: '1h' }
    );

    const Email_token = jwt.sign(
      { email: user.email },
      process.env.TOKEN_SIGNATURE,
      { expiresIn: '1h' }
    );

    const emailLink = `${process.env.FE_URL}/${Email_token}`;
    const html = `<a href='${emailLink}'>Click me</a>`;

    await sendEmail({
      to: email,
      subject: "Confirm Email",
      html,
    }).catch((err) => {
      return res.status(400).json({ msg: "Verification email error", err: err.message });
    });

    return res.status(200).json({
      message: "signup",
      token,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      msg: error.message,
      stack: error,
    });
  }
};

export const signIn = async (req, res, next) => {
    try {
        const { email, PassWord } = req.body;
        const checkUser = await userModel.findOne({ email: email })
        if (!checkUser) {
            res.status(404).send({ msg: "user doesn't exist" })
        }

        const checkPassword = await bcrypt.compare(PassWord, checkUser.PassWord)

        if (!checkPassword) {
            res.status(404).send({ msg: "wrong email or password" })
        }
        const token = jwt.sign({ email: checkUser.email, id: checkUser._id }, process.env.TOKEN_SIGNATURE, { expiresIn: '1h' })
        return res.status(200).json({ message: "signin",name:checkUser.userName, token: token,StripeId:checkUser.StripeId,isEmailVerified:checkUser.isEmailVerified})
    } catch (error) {
        return res.status(500).json({ message: "Server Error", msg: error.message, stack: error })
    }
}
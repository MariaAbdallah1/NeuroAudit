import mongoose, {Schema,model} from "mongoose";

const userSchema= new Schema({
    userName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    PassWord:{
        type:String,
        required:true
    },
     StripeId:{
        type:String,
        required:true
    },
    createdAt: { type: Date, default: Date.now },
    isEmailVerified: { type: Boolean, default: false },
    // subscriptionPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },

},{timestamps:true})

const userModel=mongoose.models.user|| model("user",userSchema)
export default userModel
import mongoose from "mongoose";
const DBconn= async ()=>{
   await mongoose.connect("mongodb://localhost:27017/GP_VulSpell").then(
        res=>{
            console.log('DB connected')
        }
    ).catch(err=>{
        console.log('Failed to connect',err);
        
    })
}
export default DBconn
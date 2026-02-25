import mongoose from 'mongoose'

const userchatschema=new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    chats:[
        {
            _id:{
                type: mongoose.Schema.Types.ObjectId,
                required:true
            },
            title:{
                type:String,
                required:true
            },
            createdAt:{
                type:Date,
                default:Date.now(),
            },
            
        },
    ],
},{timestamps:true})

export default mongoose.model("userChat",userchatschema)

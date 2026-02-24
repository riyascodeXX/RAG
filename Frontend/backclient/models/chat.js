import mongoose from 'mongoose'

const chatschema=new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    history:[
        {
            role:{
                type:String,
                enum:["user","model"],
                required:true
            },
            parts:[
                {
                text:{
                    type:String,
                    required:true
                },
            },
            ],
        },
    ],
},{timestamps:true})
export default mongoose.model("chat",chatschema)
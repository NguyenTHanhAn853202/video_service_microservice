const mongoose = require('mongoose')
const mongooseDelete = require('mongoose-delete')
const Schema = mongoose.Schema

const FeelingSchema = new Schema({
    userId:{type:mongoose.Types.ObjectId,required:true},
    type:{type:String,enum:["dislike","like"],required:true},
    videoId:{type:mongoose.Types.ObjectId,required:true,ref:"Video"},
},{
    timestamps:true
})

FeelingSchema.plugin(mongooseDelete, { overrideMethods: 'all' })

module.exports = mongoose.model("Feeling",FeelingSchema)
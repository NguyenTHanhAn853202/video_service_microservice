const mongoose = require('mongoose')
const mongooseDelete = require('mongoose-delete')
const slug  = require("mongoose-slug-updater")
mongoose.plugin(slug)
const Schema = mongoose.Schema

const VideoSchema = new Schema({
    userId:{type:mongoose.Types.ObjectId},
    title:{type:String,required:true},
    description:{type:String},
    videoUrl:{type:String,required:true},
    thumbnailUrl:{type:String,required:true},    
    views:{type:Number,default:0},
    status:{type:String,enum: ['draft', 'private', 'public'],default: 'draft'},
    hash:{type:String},
    slug:{type:String,slug:"title",unique:true},
    categoryId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category'
    },
},{
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

VideoSchema.plugin(mongooseDelete, { overrideMethods: 'all' })
VideoSchema.virtual('dislikes',{
    ref:"Feeling",
    localField:"_id",
    foreignField:"videoId",
    justOne:false,
    count:true,
    match:{type:"dislike"}
})
VideoSchema.virtual('likes',{
    ref:"Feeling",
    localField:"_id",
    foreignField:"videoId",
    justOne:false,
    count:true,
    match:{type:"like"}
})

module.exports = mongoose.model('Video', VideoSchema)
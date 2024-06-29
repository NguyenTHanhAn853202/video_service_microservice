const mongoose = require('mongoose')
const mongooseDelete  = require('mongoose-delete')

const Schema = mongoose.Schema

const CategorySchema = new Schema({
    userId:{type:String, required:true},
    title:{type:String, required:true,uniqueCaseInsensitive:true},
    description:{type:String, minLength:[3,"the description must have 3 characters"], required:[true,"the description is require"]},
})

CategorySchema.plugin(mongooseDelete, { overrideMethods: 'all' })

module.exports = mongoose.model('Category', CategorySchema)
const CategorySchema = require("../models/Category")


class CategoryController{

    async create(req,res){
        try {
            const userId = req.body.userId //req.headers["x-user-data"]
            const {title='',description=''} = req.body
            const categoryModel = new CategorySchema({title,description,userId:userId})
            await categoryModel.save()
            return res.status(200).json({
                success: true,
                message: "Category created successfully",
                source:{
                    data:categoryModel
                }
            })
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: error.message,
                
            })
        }
    }

}

module.exports = new CategoryController()
const VideoSchema = require("../models/Video")
const ffmpeg = require("fluent-ffmpeg")
const ffmpegStatic = require("ffmpeg-static")
const path = require("path")
const fs = require("fs")
const Feeling = require("../models/Feeling")
const crypto =require("crypto")
const { Console } = require("console")
const Video = require("../models/Video")
const handleThumbnail = require("../utils/handleThumnail")
const handleTrimVideo = require("../utils/handleTrimVideo")

ffmpeg.setFfmpegPath(ffmpegStatic)


class VideoController{

    async upload(req,res,next){
        const pathStatic = "./src/public"
        const pathImage = `${pathStatic}/images`
        const pathVideo = `${pathStatic}/videos`
        const userId = req.headers['x-user-data'];
        const {title,description,status} = req.body
        const videoModel = new VideoSchema({userId: userId});
        const video = req.files.video
        const videoName = `${videoModel._id}${path.parse(video.name).ext}`
        video.mv(`${pathVideo}/${videoName}`,async(err)=>{
            if(err) return res.status(400).json({
                success: false,
                message: err.message
            })
            const hash = crypto.createHash("sha256")
            const stream = fs.createReadStream(`${pathVideo}/${videoName}`)

            stream.on("data",(data)=>{
                hash.update(data, 'utf8');
            })
            stream.on("end",async()=>{
                const videoHash = hash.digest("hex")
                videoModel.hash= videoHash
                const existsHash = await Video.exists({hash:videoHash})
                if(existsHash){
                    if(fs.existsSync(`${pathVideo}/${videoName}`)){
                        fs.unlink(`${pathVideo}/${videoName}`,(err)=>{
                            if(err){
                                console.log(err.message);
                            }
                            else{
                                console.log("deleted file")
                            }
                        })
                    }
                    return res.status(401).json({
                        success: false,
                        message: "Video already exists"
                    })
                }
                let thumbnailUrl
                const pathIn = `${pathVideo}/${videoName}`
                if(!req.files.thumbnail){
                    const pathOut = `${pathImage}/${videoModel._id}.png`
                    handleThumbnail(pathIn,pathOut)
                    thumbnailUrl = `${videoModel._id}.png`
                }
                else{
                    const thumbnail = req.files.thumbnail
                    thumbnail.name = `${videoModel._id}${path.parse(thumbnail.name).ext}`
                    thumbnail.mv(`${pathImage}/${thumbnail.name}`,(err)=>{
                        if(err) return res.status(400).json({
                            success: false,
                            message: err.message
                        })
                        
                    })
                
                    thumbnailUrl =  thumbnail.name
                }
                const pathOut = `${pathVideo}/${videoModel._id}.mpd`
                handleTrimVideo(pathIn,pathOut)
                videoModel.thumbnailUrl = thumbnailUrl
                videoModel.videoUrl = `${videoModel._id}.mpd`
                videoModel.title = title
                videoModel.description = description
                videoModel.status = status
                await videoModel.save()
                return res.status(200).json({
                    message: "Video uploaded successfully"
                })
            });
            stream.on("error",async(error)=>{
                return res.json(500).status(error.message)
            })
            
        })    
    }

    async update(req,res){
        const {title,description,status} = req.body
        const userId = req.headers['x-user-data'];
        const video = await VideoSchema.findOneAndUpdate({_id:req.params.id,userId},{title,description,status},{new:true})
        if(!video) return res.status(404).json({
            success: false,
            message: "Video not found"
        })
        return res.status(200).json({
            success: true,
            message: "Video updated successfully",
            source:{
                data:video
            }
        })
    }

    async updateView(req, res) {
        const videoModel = await Video.updateOne({_id:req.params.id},{$inc:{views:1}})
        if(videoModel.matchedCount && videoModel.modifiedCount<0) return res.status(404).json({
            success: false,
            message: "Video not found"
        })
        return res.status(200).json({
            success: true,
            message: "Video view updated successfully"
        })
    }

    async getVideos(req,res){
        const limit = 50
        const videos = await VideoSchema.find({})
        
        return res.status(200).json({
            success: true,
            source:{
                data:videos
            }
        })
    }
    
    async getVideo(req,res){
        const {slug=""}  = req.params
        if(!slug) return res.status(404).json({
            success: false,
            message: "Video not found"
        })
        const video = await VideoSchema.findOne({slug:slug}).populate("dislikes").populate("likes")
        if(!video) return res.status(404).json({
            success: false,
            message: "Video not found"
        })
        return res.status(200).json({
            success: true,
            source:{
                data:video
            }
        })
    }

}

module.exports = new VideoController()
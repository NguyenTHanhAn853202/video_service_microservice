const ffmpeg = require("fluent-ffmpeg")
const ffmpegStatic = require('ffmpeg-static')
ffmpeg.setFfmpegPath(ffmpegStatic)
const fs = require("fs")

const handleTrimVideo=(inputPath,outputPath)=>{
    ffmpeg()
        .input(inputPath)
        .format("dash")
        .output(outputPath)
        .on("end",()=>{
            if(fs.existsSync(inputPath)){
                fs.unlink(inputPath,(err)=>{
                    if(err) console.error(err)
                    console.log("deleted")
                })
            }
        })
        .run()                
}

module.exports = handleTrimVideo;
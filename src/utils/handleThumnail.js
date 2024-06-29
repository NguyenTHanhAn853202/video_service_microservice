const ffmpeg = require("fluent-ffmpeg")
const ffmpegStatic = require('ffmpeg-static')

ffmpeg.setFfmpegPath(ffmpegStatic)

const handleThumbnail = (inputPath,outputPath)=>{
    
    ffmpeg()
        .input(inputPath)
        .outputOptions(['-f image2', '-vframes 1', '-vcodec png', '-f rawvideo', '-s 320x240', '-ss 00:00:01'])
        .output(outputPath)
        .run() 
}

module.exports = handleThumbnail
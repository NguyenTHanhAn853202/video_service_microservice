const videoSecure = require("./videoSecure.routes")
const videoPublic = require("./videoPublic.routes")


function routes(app) {
    app.use("/api/v1/video/secure", videoSecure)
    app.use("/api/v1/video/public",videoPublic)
}

module.exports = routes
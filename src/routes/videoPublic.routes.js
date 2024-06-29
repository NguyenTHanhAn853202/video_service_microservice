const categoryController = require("../controllers/category.controller");
const VideoController = require("../controllers/video.controller");

const router = require("express").Router();

router.get("/",VideoController.getVideos)
router.get("/:slug",VideoController.getVideo)
router.put("/view/:id",VideoController.updateView)

router.post("/category",categoryController.create)


module.exports = router
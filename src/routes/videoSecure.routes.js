const VideoController = require("../controllers/video.controller");

const router = require("express").Router();

router.post("/upload",VideoController.upload)
router.put("/update/:id",VideoController.update)


module.exports = router
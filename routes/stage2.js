const express = require("express");
const stageTwoConroller = require("../controllers/stage2Controller");
const router = express.Router();

router.get("/", stageTwoConroller.getStage2);
router.post("/", stageTwoConroller.postStage2);

module.exports = router;

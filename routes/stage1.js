const express = require("express");
const router = express.Router();
const stage1Controller = require("../controllers/stage1Controller");

router.get("/", stage1Controller.getStage1);
router.post("/", stage1Controller.postStage1);

module.exports = router;

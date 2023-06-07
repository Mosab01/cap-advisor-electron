const express = require("express");
const router = express.Router();
const s1ResultController = require("../controllers/stage1ResultController");

router.get("/", s1ResultController.getS1Result);

module.exports = router;

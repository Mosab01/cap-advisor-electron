const express = require("express");
const router = express.Router();
const s2ResultController = require("../controllers/stage2ResultController");

router.get("/", s2ResultController.getS2Result);

module.exports = router;

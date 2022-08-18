const express = require("express");
const router = express.Router();

const initCtrl = require("../controllers/initDBController");

//populate dababase
router.get("/", initCtrl.index);

module.exports = router;

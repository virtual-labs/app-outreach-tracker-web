const express = require("express");

const router = express.Router();
const { getInstituteList, addWorkshop } = require("../controllers/workshop");

router.route("/instituteList").get(getInstituteList);
router.route("/addWorkshop").post(addWorkshop);

module.exports = router;

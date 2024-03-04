const express = require("express");

const router = express.Router();
const {
  getInstituteList,
  addWorkshop,
  getWorkshops,
} = require("../controllers/workshop");

router.route("/instituteList").get(getInstituteList);
router.route("/addWorkshop").post(addWorkshop);
router.route("/getWorkshops").get(getWorkshops);

module.exports = router;

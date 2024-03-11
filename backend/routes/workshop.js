const express = require("express");

const router = express.Router();
const {
  getInstituteList,
  addWorkshop,
  getWorkshops,
  getTemplates,
} = require("../controllers/workshop");

router.route("/instituteList").get(getInstituteList);
router.route("/addWorkshop").post(addWorkshop);
router.route("/getWorkshops").get(getWorkshops);
router.route("/getTemplates").get(getTemplates);

module.exports = router;

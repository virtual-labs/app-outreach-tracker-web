const express = require("express");

const router = express.Router();
const {
  getInstituteList,
  addWorkshop,
  getWorkshops,
  getTemplates,
  addTemplates,
  addUser,
  addInstitute,
  getUsers,
  getInstitutes,
  deleteEntry,
  editWorkshops,
} = require("../controllers/workshop");

router.route("/instituteList").get(getInstituteList);
router.route("/addWorkshop").post(addWorkshop);
router.route("/getWorkshops").get(getWorkshops);
router.route("/editWorkshop").post(editWorkshops);
router.route("/getTemplates").get(getTemplates);
router.route("/addTemplates").post(addTemplates);
router.route("/getInstitutes").get(getInstitutes);
router.route("/addInstitute").post(addInstitute);
router.route("/getUsers").get(getUsers);
router.route("/addUser").post(addUser);
router.route("/").delete(deleteEntry);

module.exports = router;

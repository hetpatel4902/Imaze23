const express = require("express");
const router = express.Router();

const {
  getAllEvents,
  getOneEvent,
  getEventsCategorized,
  getUserEvents,
  getStaticCombos,
  checkDynamicCombo,
  buttonVisibility,
  getCertificate,
  getUserDetails,
  validateUserOtp,
} = require("../controllers/Users");

//events
router.route("/events").get(getAllEvents); //1.all the events 2.search filter 3.specific fields
router.route("/events/category").get(getEventsCategorized); //get categorized events
router.route("/events/:id").get(getOneEvent); //get event details [:id = event id]
router.route("/events/:uid").get(getUserEvents); //get events bought by the user [:uid = user id]

//combos
router.route("/combos").get(getStaticCombos); //get all the static combos
router.route("/combos/dynamic").post(checkDynamicCombo); //check if the dynamic combo is valid [for time clashes]

//certificates
router.route("/certificates/:uid/visibility").get(buttonVisibility); //visible only if the user has attended that event
router.route("/certificates/:uid/:eid").get(getCertificate); //download certificate [:eid = event id]

//user
router.route("/:uid").get(getUserDetails); // url-> /api/v1/user
router.route("/:uid/validateOTP").post(validateUserOtp); //req.body = { otp }

module.exports = router;

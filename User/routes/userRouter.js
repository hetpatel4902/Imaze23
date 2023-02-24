const express = require("express");
const router = express.Router();
const authmiddleware = require('../middleware/authmiddleware')

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
  updatepassword,
  getPaymentHistory
} = require("../controllers/Users");

//events
router.route("/events").get(authmiddleware,getAllEvents); //1.all the events[without search and fields] 2.search filter[?search=tech] 3.specific fields[?fields=name,venue...]
router.route("/events/category").get(authmiddleware,getEventsCategorized); //get categorized events
router.route("/events/:eid").get(authmiddleware,getOneEvent); //get event details [:eid = event id]
router.route("/events/user/:uid").get(authmiddleware,getUserEvents); //get events bought by the user, both combos and individual events [:uid = user id]

//combos
router.route("/combos").get(authmiddleware,getStaticCombos); //get all the static combos
router.route("/combos/dynamic").post(authmiddleware,checkDynamicCombo); //[req.body=[event_id1,event_id2,.....]] check if the dynamic combo is valid [for time clashes] 

//certificates
router.route("/certificates/:uid/visibility/:eid").get(authmiddleware,buttonVisibility); //visible only if the user has attended that event
router.route("/certificates/:uid/event/:eid").get(authmiddleware,getCertificate); //download certificate [:eid = event id] [:uid = user id]

//user
router.route("/:uid").get(authmiddleware,getUserDetails); // url-> /api/v1/user/${userid}
router.route("/:email/validateOTP").post(validateUserOtp); //req.body = { otp:otp }
router.route("/:email/password").patch(updatepassword); //req.body = {password:password}
router.route("/:uid/payment/history").get(authmiddleware,getPaymentHistory);

module.exports = router;

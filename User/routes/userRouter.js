const express = require("express");
const router = express.Router();
const authmiddleware = require("../middleware/authmiddleware");

const {
  registerUsers,
  forgotPasswordUsers,
  loginUsers,
} = require('../controllers/Users Auth')
const {
  getAllEvents,
  getOneEvent,
  getEventsCategorized,
  getUserEvents,
  getStaticCombos,
  checkUserEvent,
  checkCombo,
  buttonVisibility,
  getCertificate,
  getUserDetails,
  updateUserDetails,
  validateUserOtp,
  updatepassword,
  getPaymentHistory,
  payOffline,
  payOnline
} = require("../controllers/Users");


//auth
router.route('/login').post(loginUsers)
router.route('/register').post(registerUsers)
router.route('/forgotpassword').patch(forgotPasswordUsers)

//events
router.route("/events").get(authmiddleware, getAllEvents); //1.all the events[without search and fields] 2.search filter[?search=tech] 3.sort filter [?sort=noOfParticipants] 4.specific fields[?fields=name,venue...]
router.route("/events/category").get(authmiddleware, getEventsCategorized); //get categorized events
router.route("/events/:eid").get(authmiddleware, getOneEvent); //get event details [:eid = event id] [req.body = {type:NORMAL/FLAGSHIP/CULTURAL}]
router.route("/events/user/:uid").get(authmiddleware, getUserEvents); //get events bought by the user, both combos and individual events [:uid = user id]

//combos
router.route("/combos").get(authmiddleware, getStaticCombos); //get all the static combos

//checking validity
router.route("/combos/:uid/check").post(authmiddleware, checkCombo); //[req.body={events = [event_id1,event_id2,.....],combotype:STATIC/DYNAMIC,price} check if the combo is valid and if valid then create the combo [for time clashes]
router.route("/events/:uid/check").post(authmiddleware, checkUserEvent); //[req.body = {price,eid:event_Id}] call this api when proceed to pay button is clicked , this will return clashing events if the events are clashing with previously bought events else will create the order

//certificates
router.route("/certificates/:uid/visibility/:eid").get(authmiddleware, buttonVisibility); //visible only if the user has attended that event
router.route("/certificates/:uid/event/:eid").get(authmiddleware, getCertificate); //download certificate [:eid = event id] [:uid = user id]

//user
router.route("/:uid").get(authmiddleware,getUserDetails); // url-> /api/v1/user/${userid}
router.route("/:uid").post(authmiddleware,updateUserDetails);//req.body= {email:,name:}
router.route("/:email/validateOTP").post(validateUserOtp); //req.body = { otp:otp }
router.route("/:email/password").patch(updatepassword); //req.body = {password:password}

//payment
router.route("/:uid/payment/history").get(authmiddleware, getPaymentHistory); //get the payment history [both individual and combos]
router.route("/:uid/payment/offline").post(authmiddleware, payOffline); //call this api to generate otp for offline purchase [req.body={orderId:userEventId or comboId, isCombo:true/false,eventType:Tech,NonTech,Cultural,Flagship,Workshop }]
//pay online
router.route("/:uid/payment/online").post(authmiddleware,payOnline); //call this api after paying online and send the transaction id [req.body = {orderId:userEventId or comboId,transId:'',isCombo:true/false,eventType:Tech,NonTech,Cultural,Flagship,Workshop}]


module.exports = router;

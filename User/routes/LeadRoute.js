const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authmiddleware')

const {eventFetch,participantList,alreadyAttendedUser,updateAttendance,updateEvent,fetchLead,fetchWinners,updateWinners,searchUserEmail,showEventOfflineForUser,verifyEventOfflineOTP,showComboOfflineOTP,verifyComboOfflineOTP,eventParticipantExcel,eventAttendedExcel,verifiedOfflineEvent,rejectOfflineEvent,getIndividualCulturalEvent,getAllCulturalEvents,getCulturalParticipantExcel,getIdeathonEvents,getIndividualFlagshipEvent,getFlagshipAttendance,setFlagshipAttendance,getFlagshipParticipantExcel,getFlagshipAttendanceExcel,getToyothonEvents,getUserDetails,reduceToken,getAllIncompleteUsersOnline,acceptOnlinePayment,declineOnlinePayment,getPaymentsOnRegularBasisExcel} = require('../controllers/LeadController')
const {loginLeads} = require('../controllers/Leads Auth')

//login
router.route('/loginLeads').post(loginLeads)

router.route('/eventFetch/:eid').get(authMiddleware,eventFetch)
router.route('/participantList/:eid').get(authMiddleware,participantList)
router.route('/alreadyAttendedUser/:eid').get(authMiddleware,alreadyAttendedUser)
router.route('/updateAttendance/:eid').post(authMiddleware,updateAttendance)
router.route('/updateEvent/:eid').post(authMiddleware,updateEvent)
router.route('/fetchLead/:lid').get(authMiddleware,fetchLead)
router.route('/fetchWinners/:eid').get(authMiddleware,fetchWinners)
router.route('/updateWinners/:eid').post(authMiddleware,updateWinners)
router.route('/searchUserEmail').get(authMiddleware,searchUserEmail)
router.route('/showEventOfflineForUser').post(showEventOfflineForUser)
router.route('/verifyEventOfflineOTP').post(verifyEventOfflineOTP)
router.route('/showComboOfflineOTP').post(showComboOfflineOTP)
router.route('/verifyComboOfflineOTP').post(verifyComboOfflineOTP)
router.route('/eventParticipantExcel/:eid').get(authMiddleware,eventParticipantExcel)
router.route('/eventAttendedExcel/:eid').get(authMiddleware,eventAttendedExcel)

//it will veridy or reject entries of user on publicity screen
router.route('/verifiedOfflineEvent').post(verifiedOfflineEvent)
router.route('/rejectOfflineEvent').post(rejectOfflineEvent)

//get user details
router.route('/getUserDetails/:uid').get(authMiddleware,getUserDetails)

//cultural screens
router.route('/getAllCulturalEvents').get(authMiddleware,getAllCulturalEvents)
router.route('/getIndividualCulturalEvent/:cid').get(authMiddleware,getIndividualCulturalEvent)
router.route('/getCulturalParticipantExcel/:cid').get(authMiddleware,getCulturalParticipantExcel)

//flagship screens
router.route('/getIdeathonEvents').get(authMiddleware,getIdeathonEvents)
router.route('/getIndividualFlagshipEvent/:fid').get(authMiddleware,getIndividualFlagshipEvent)
router.route('/getFlagshipAttendance/:fid').get(authMiddleware,getFlagshipAttendance)
router.route('/setFlagshipAttendance/:fid').post(authMiddleware,setFlagshipAttendance)
router.route('/getFlagshipParticipantExcel/:fid').get(authMiddleware,getFlagshipParticipantExcel)
router.route('/getFlagshipAttendanceExcel/:fid').get(authMiddleware,getFlagshipAttendanceExcel)
router.route('/getToyothonEvents').get(authMiddleware,getToyothonEvents)

//happy street
router.route('/reduceToken/:uid').get(authMiddleware,reduceToken)

//coordinator screen
router.route('/getAllIncompleteUsersOnline').get(authMiddleware,getAllIncompleteUsersOnline)
router.route('/acceptOnlinePayment/:eid').get(authMiddleware,acceptOnlinePayment)
router.route('/declineOnlinePayment').get(authMiddleware,declineOnlinePayment)
router.route('/getPaymentsOnRegularBasisExcel').post(authMiddleware,getPaymentsOnRegularBasisExcel)

module.exports = router
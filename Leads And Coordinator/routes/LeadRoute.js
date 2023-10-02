const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authentication')

const {eventFetch,participantList,alreadyAttendedUser,updateAttendance,updateEvent,fetchLead,fetchWinners,updateWinners,searchUserEmail,showEventOfflineForUser,verifyEventOfflineOTP,showComboOfflineOTP,verifyComboOfflineOTP,eventParticipantExcel,eventAttendedExcel,verifiedOfflineEvent,rejectOfflineEvent,getIndividualCulturalEvent,getAllCulturalEvents} = require('../controller/LeadController')

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

//cultural screens
router.route('/getAllCulturalEvents').get(getAllCulturalEvents)
router.route('/getIndividualCulturalEvent/:cid').get(getIndividualCulturalEvent)

module.exports = router
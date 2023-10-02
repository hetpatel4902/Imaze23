const express = require('express')
const router = express.Router()

const {eventFetch,participantList,alreadyAttendedUser,updateAttendance,updateEvent,fetchLead,fetchWinners,updateWinners,searchUserEmail,showEventOfflineOTP,verifyEventOfflineOTP,showComboOfflineOTP,verifyComboOfflineOTP,eventParticipantExcel,eventAttendedExcel} = require('../controller/LeadController')

router.route('/eventFetch/:eid').get(eventFetch)
router.route('/participantList/:eid').get(participantList)
router.route('/alreadyAttendedUser/:eid').get(alreadyAttendedUser)
router.route('/updateAttendance/:eid').post(updateAttendance)
router.route('/updateEvent/:eid').post(updateEvent)
router.route('/fetchLead/:lid').get(fetchLead)
router.route('/fetchWinners/:eid').get(fetchWinners)
router.route('/updateWinners/:eid').post(updateWinners)
router.route('/searchUserEmail').get(searchUserEmail)
router.route('/showEventOfflineOTP').post(showEventOfflineOTP)
router.route('/verifyEventOfflineOTP').post(verifyEventOfflineOTP)
router.route('/showComboOfflineOTP').post(showComboOfflineOTP)
router.route('/verifyComboOfflineOTP').post(verifyComboOfflineOTP)
router.route('/eventParticipantExcel/:eid').get(eventParticipantExcel)
router.route('/eventAttendedExcel/:eid').get(eventAttendedExcel)

module.exports = router
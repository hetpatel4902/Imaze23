const express = require('express')
const router = express.Router()

const {addAnnouncement,fetchAllAnnouncements,searchEvent} = require('../controller/CoordinatorController')

router.route('/addAnnouncement').post(addAnnouncement)
router.route('/fetchAllAnnouncements').get(fetchAllAnnouncements)
router.route('/searchEvent').get(searchEvent)

module.exports = router
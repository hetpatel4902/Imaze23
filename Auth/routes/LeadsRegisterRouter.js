const express = require('express')
const router = express.Router()

const {registerLeads} = require('../controllers/Leads')

router.route('/').post(registerLeads)


module.exports = router
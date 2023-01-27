const express = require('express')
const router = express.Router()

const {loginLeads} = require('../controllers/Leads')

router.route('/').post(loginLeads)


module.exports = router
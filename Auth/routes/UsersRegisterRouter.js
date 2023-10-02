const express = require('express')
const router = express.Router()

const {registerUsers} = require('../controllers/Users')

router.route('/').post(registerUsers)


module.exports = router
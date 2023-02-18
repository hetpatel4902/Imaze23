const express = require('express')
const router = express.Router()

const {registerCoordinator} = require('../controllers/coordinator')

router.route('/').post(registerCoordinator)


module.exports = router
const express = require('express')
const router = express.Router()

const {loginCoordinator} = require('../controllers/coordinator')

router.route('/').post(loginCoordinator)



module.exports = router
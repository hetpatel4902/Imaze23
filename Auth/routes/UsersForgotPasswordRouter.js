const express = require('express')
const router = express.Router()

const {forgotPasswordUsers} = require('../controllers/Users')

router.route('/').patch(forgotPasswordUsers)


module.exports = router
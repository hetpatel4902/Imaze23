const express = require('express')
const router = express.Router()

const {loginUsers} = require('../controllers/Users')

router.route('/').post(loginUsers)


module.exports = router
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const AnnouncementSchema = new mongoose.Schema({
  description:{
    type:String,
    required:[true,'Please provide Announcement'],
  }
})



module.exports = mongoose.model('Announcement',AnnouncementSchema)
const mongoose = require('mongoose')
require('dotenv').config()

const AnnouncementSchema = new mongoose.Schema({
  description:{
    type:String,
    required:[true,'Please provide Announcement'],
  }
})



module.exports = mongoose.model('Announcement',AnnouncementSchema)
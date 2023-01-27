const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const UserEventSchema = new mongoose.Schema({
  userId:{
    type:mongoose.Types.ObjectId,
    ref:"Users"
  },
  event:{
    type:[Object],
    required:[true,'Please provide event details']
  }
})



module.exports = mongoose.model('User-Event',UserEventSchema)
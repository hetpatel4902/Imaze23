const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { boolean } = require('joi')
require('dotenv').config()

const StaticComboSchema = new mongoose.Schema({
  price:{
    type:Number,
    required:[true,'Please provide event price']
  },
  events:{
    type:[mongoose.Types.ObjectId],
    ref:'Event',
    required:[true,'Please PRovide Evevnt ID\'s']
  }
})

module.exports = mongoose.model('StaticCombo',StaticComboSchema)
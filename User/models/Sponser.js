const mongoose = require('mongoose')
require('dotenv').config()

const SponserSchema = new mongoose.Schema({
  url:{
    type:String,
  }
})



module.exports = mongoose.model('Sponsers',SponserSchema)
const mongoose = require('mongoose')
require('dotenv').config()

const StaticComboSchema = new mongoose.Schema({
  price:{
    type:Number,
    required:[true,'Please provide event price']
  },
  events:{
    type:[mongoose.Types.ObjectId],
    ref:'Event',
    required:[true,'Please Provide Event ID\'s']
  }
})

module.exports = mongoose.model('StaticCombo',StaticComboSchema)
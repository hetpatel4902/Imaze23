const mongoose = require('mongoose')
require('dotenv').config()

const InvoiceSchema = new mongoose.Schema({
  number:{
    type:Number,
    default:1000
  }
})



module.exports = mongoose.model('Invoice',InvoiceSchema)
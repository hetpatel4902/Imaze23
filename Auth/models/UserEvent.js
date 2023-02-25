const mongoose = require('mongoose')
require('dotenv').config()
const UserEventSchema = new mongoose.Schema({
  userId:{
    type:mongoose.Types.ObjectId,
    ref:"Users"
  },
  eventid:{
    type:mongoose.Types.ObjectId,
    ref:'Event',
    required:[true,'Please provide event details']
  },
  price:{
    type:Number,
    required:[true,'Please provide price']
  },
  payment_mode:{
    type:String,
    enum:['ONLINE','OFFLINE'],
    required:[true,'Please provide payment mode']
  },
  payment_status:{
    type:String,
    enum:['COMPLETED','INCOMPLETE','NEW'],//new : if otp is not yet generated
    required:[true,'Please provide payment status']
  },
  cashotp:{
    type:Number,
    default:0
  }
})



module.exports = mongoose.model('UserEvent',UserEventSchema)
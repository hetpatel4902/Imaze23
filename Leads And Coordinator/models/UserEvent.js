const mongoose = require('mongoose')
require('dotenv').config()
//combos history and static combos needed
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
    enum:['COMPLETED','INCOMPLETE'],
    required:[true,'Please provide payment status']
  },
  cashotp:{
    type:Number,
    default:0
  }
  //add price , payment_mode
})



module.exports = mongoose.model('UserEvent',UserEventSchema)
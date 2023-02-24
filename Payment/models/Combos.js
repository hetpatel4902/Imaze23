const mongoose = require('mongoose')
require('dotenv').config()
//combos history and static combos needed
const CombosSchema = new mongoose.Schema({
  userId:{
    type:mongoose.Types.ObjectId,
    ref:"Users"
  },
  event:{
    type:[mongoose.Types.ObjectId],//[event ids]
    required:[true,'Please provide event details'],
    ref:"Event"
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
  combotype:{
    type:String,
    enum:['DYNAMIC','STATIC'],
    required:[true,'Please provide combotype']
  },
  cashotp:{
    type:Number,
    default:0
  }
  //add price , payment_mode
})



module.exports = mongoose.model('Combo',CombosSchema)
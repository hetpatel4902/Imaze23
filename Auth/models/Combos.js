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
    required:[true,'Please provide event details']
  },
  price:{
    type:Number,
    required:[true,'Please provide price']
  },
  payment_mode:{
    type:String,
    enum:['ONLINE','OFFLINE']
  },
  payment_status:{
    type:String,
    enum:['COMPLETED','INCOMPLETE']
  }
  //add price , payment_mode
})



module.exports = mongoose.model('Combo',CombosSchema)
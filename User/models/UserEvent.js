const mongoose = require("mongoose");
require("dotenv").config();
const UserEventSchema = new mongoose.Schema({
  userId:{
    type:mongoose.Types.ObjectId,
    ref:"Users"
  },
  eventid:{//cultural , tech ,non tech,workshop,flagship
    type:mongoose.Types.ObjectId,
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
  },
  date:{//format dd-mm-yyyy
    type:String,
  },
  category:{
    type:String,
    enum:["NORMAL","FLAGSHIP","CULTURAL"],
    required:[true,"Please provide the category of the event"]
  },
  transId:{
    type:String,
  },
  transaction_image:{
    type:String
  },
  team:{
    type:Object,
    default:{}
  },
  receipt_url:{
    type:String,
    default:''
  }
})



module.exports = mongoose.model("UserEvent", UserEventSchema);

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User=require('./User')
const { boolean } = require('joi')
require('dotenv').config()

const EventSchema = new mongoose.Schema({
  category:{
    type:String,
    required:[true,'Please provide Category']
  },
  name:{
    type:String,
    required:[true,'Please provide Event Name']
  },
  image:{
    type:String,
    required:[true,'Please provide Image']
  },
  date:{
    type: String,
    required:[true,'Please provide Date']
  },
  time:{
    type:String,
    required:[true,'Please provide Time']
  },
  price:{
    type:Number,
    required:[true,'Please provide Event Price']
  },
  description:{
    type:String,
    required:[true,'Please provide Description']
  },
  venue:{
    type:String,
    required:[true,'Please provide Venue']
  },
  event_coordinator:{
    type:[Object],
    required:[true,'Please provide Event Coordinator details']
  },
  totalwinners:{
    type:Number,
    required:[true,'Please provide Total Number of Winnners']
  },
  participants:{
    type:[mongoose.Types.ObjectId],
    ref:"Users",
    default:[]
  },
  winner:{
    type:[mongoose.Types.ObjectId],
    ref:"Users",
    default:[]
  },
  attendance:{
    type:[mongoose.Types.ObjectId],
    ref:"Users",
    default:[]
  }
  
})


module.exports = mongoose.model('Event',EventSchema)
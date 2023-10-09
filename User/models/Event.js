const { boolean } = require('joi')
const mongoose = require('mongoose')
require('dotenv').config()

const EventSchema = new mongoose.Schema({
  isDiploma:{
    type:Boolean,
    default:false
  },
  category:{
    type:String,
    enum:["Tech","NonTech","Workshop"],
    required:[true,'Please provide Category']
  },
  event_type:{
    type:String,
    default:"NORMAL"
  },
  type:{
    type:String,
    enum:["SOLO","GROUP"]
  },
  min_members:{
    type:Number,
  },
  max_members:{
    type:Number,
  },
  title:{
    type:String
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
  },//24h format 
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
    type:[Object],//{name and phone number}
    required:[true,'Please provide Event Coordinator details']
  },
  totalwinners:{
    type:Number,
    required:[true,'Please provide Total Number of Winnners']
  },
  participants:{
    type:[],
    default:[]
  },
  winner:{
    type:[],
    default:[]
  },
  attendance:{
    type:[],
    default:[]
  },
  maxparticipants:{
    type:Number,
    required:[true,'Please provide number of participants']
  },
  isAvailable:{
    type:Boolean,
    default:true
  },
  noOfParticipants:{
    type:Number,
    default:0
  }
})

module.exports = mongoose.model('Event',EventSchema)
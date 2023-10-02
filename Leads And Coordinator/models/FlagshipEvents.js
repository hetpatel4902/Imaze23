const mongoose = require('mongoose')
require('dotenv').config()

const FlagshipEventSchema = new mongoose.Schema({
  category:{//ideathon , toyothon, 
    type:String,
    enum:["Ideathon","Toyothon","HappyStreet"],
    required:[true,'Please provide Category']
  },
  tokens:{
    type:Number,
    default:80
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
    required:[true,'Please provide Total Number of Winners']
  },
  participants:{//[{team name:,team leader:id,members:[ids],idcard:,poster:}]
    type:[Object],
    default:[]
  },
  winner:{//[{team name:,members:[ids]}]
    type:[Object],
    default:[]
  },
  attendance:{//[{team name:,members:[ids]}]
    type:[Object],
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
  noOfParticipants:{//no of teams
    type:Number,
    default:0
  },
  type: {
    type: String,
    enum: ["SOLO", "GROUP"],
  }
})

FlagshipEventSchema.pre("save",async function(){
  console.log(this.participants);
  this.noOfParticipants = this.participants.length;
})


module.exports = mongoose.model('FlagshipEvents',FlagshipEventSchema)
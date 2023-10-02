const mongoose = require('mongoose')
require('dotenv').config()

const CulturalSchema = new mongoose.Schema({
  category:{
    type:String,
    default:"Cultural"
  },
  type:{
    type:String,
    enum:["SOLO","GROUP"]
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
    type:[mongoose.Types.ObjectId],
    ref:"Users",
    default:[]
  },
  winner:{
    type:[mongoose.Types.ObjectId],
    ref:"Users",
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

CulturalSchema.pre("save",async function(){
  console.log(this.participants);
  this.noOfParticipants = this.participants.length;
})


module.exports = mongoose.model('SoloCultural',CulturalSchema)
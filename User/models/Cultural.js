const mongoose = require("mongoose");
require("dotenv").config();

const CulturalSchema = new mongoose.Schema({
  tokens:{
    type:Number,
    default:60
  },
  category:{
    type:String,
    default:"Cultural"
  },
  type: {
    type: String,
    enum: ["SOLO", "GROUP"],
  },
  name: {
    type: String,
    required: [true, "Please provide Event Name"],
  },
  image: {
    type: String,
    required: [true, "Please provide Image"],
  },
  date: {
    type: String,
    required: [true, "Please provide Date"],
  },
  time:{
    type:String,
    required:[true,'Please provide Time']
  },//24h format 
  price:{
    type:Number,
    required:[true,'Please provide Event Price']
  },
  description: {
    type: String,
    required: [true, "Please provide Description"],
  },
  venue: {
    type: String,
    required: [true, "Please provide Venue"],
  },
  event_coordinator: {
    type: [Object], //{name and phone number}
    required: [true, "Please provide Event Coordinator details"],
  },
  totalwinners: {
    type: Number,
    required: [true, "Please provide Total Number of Winnners"],
  },
  participants:{
    type:[],
    default:[]
  },
  winner:{
    type:[],
    default:[]
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  noOfParticipants: {
    type: Number,
    default: 0,
  },
});

CulturalSchema.pre("save", async function () {
  this.noOfParticipants = this.participants.length;
});

module.exports = mongoose.model("soloCultural", CulturalSchema);

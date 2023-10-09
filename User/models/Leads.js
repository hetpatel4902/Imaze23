const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const LeadsSchema = new mongoose.Schema({
  eventId:{
    type:mongoose.Types.ObjectId
  },
  email:{
    type:String,
    required:[true,'Please provide valid Email'],
    match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'Please provide valid email'],
    unique:true,
  },
  password:{
    type:String,
    required:[true,'Please provide valid Password']
  },
  type:{
    type:String,
    required:[true,'Please provide type'],
    enum:['CULTURAL','FLAGSHIP','NORMAL']
  }
  
})

LeadsSchema.pre('save',async function(){
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password,salt)
})

LeadsSchema.methods.createJWT = function(){
  return jwt.sign({Id:this._id,name:this.name},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
}
LeadsSchema.methods.comparePassword = async function(candidatePassword){
  const isMatch = await bcrypt.compare(candidatePassword,this.password)
  return isMatch
}
module.exports = mongoose.model('Leads',LeadsSchema)
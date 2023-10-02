const express = require("express");
const app=express();
const Coordinator = require('../models/Coordinator')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError,UnauthenticatedError} = require('../errors/index')
const jwt = require('jsonwebtoken')
const mime = require("mime");
const xl = require("excel4node");
const path = require("path");
const nodemailer = require('nodemailer');
const Event = require('../models/Event')
const User = require('../models/Users')
const Lead = require('../models/Leads')
const UserEvent = require('../models/UserEvent')
const Combos = require('../models/Combos')
const { uploadImageToS3 } = require("../utils/s3");
const fs = require('fs')
const Flagship = require('../models/FlagshipEvents')
const Cultural = require('../models/Cultural')

const eventFetch = async (req,res) => {
  const {eid} = req.params
  if(!eid){
    throw new BadRequestError('Please provide Event id')
  }
  const event = await Event.findOne({_id:eid})
  res.status(StatusCodes.OK).json({res:'Success',data:event})
}

const participantList = async (req,res) => {
  const {eid} = req.params
  if(!eid){
    throw new BadRequestError('Please provide Event id')
  }
  const event = await Event.findOne({_id:eid})
  const arr=[]
  for(var i=0;i<event?.participants.length;++i){
    const user = await User.findOne({_id:event?.participants[i]})
    arr.push(user)
  }
  res.status(StatusCodes.OK).json({res:"Success",data:arr})

}

const alreadyAttendedUser = async (req,res) => {
  const {eid} = req.params
  if(!eid){
    throw new BadRequestError('Please provide Event id')
  }
  const event = await Event.findOne({_id:eid})
  const arr=[]
  for(var i=0;i<event?.attendance.length;++i){
    const user = await User.findOne({_id:event?.attendance[i]})
    arr.push(user)
  }
  res.status(StatusCodes.OK).json({res:"Success",data:arr})

}

const updateAttendance = async (req,res) => {
  const {eid} = req.params
  const {attendance} = req.body
  if(!eid){
    throw new BadRequestError('Please provide Event id')
  }
  if(!attendance){
    throw new BadRequestError('Please provide Attendance list')
  }
  const event = await Event.findOneAndUpdate({_id:eid},req.body,{ new: true, runValidators: true })
  res.status(StatusCodes.OK).json({res:"Success",data:event})
}

const updateEvent = async (req,res) => {
  const {eid} = req.params
  if(!eid){
    throw new BadRequestError('Please provide Event id')
  }
  const event = await Event.findOneAndUpdate({_id:eid},req.body,{ new: true, runValidators: true })
  res.status(StatusCodes.OK).json({res:"Success",data:event})
}

const fetchLead = async (req,res) => {
  const {lid} = req.params
  if(!lid){
    throw new BadRequestError('Please provide Lead id')
  }
  const lead = await Lead.findOne({_id:lid})
  res.status(StatusCodes.OK).json({res:"Success",data:lead})
}

const fetchWinners = async (req,res) => {
  const {eid} = req.params
  if(!eid){
    throw new BadRequestError('Please provide Event id')
  }
  const event = await Event.findOne({_id:eid})
  const arr=[]
  for(var i=0;i<event?.winner.length;++i){
    const user = await User.findOne({_id:event?.winner[i]})
    arr.push(user)
  }
  res.status(StatusCodes.OK).json({res:"Success",data:arr})
}

const updateWinners = async (req,res) => {
  const {eid} = req.params
  const {winner} = req.body
  if(!eid){
    throw new BadRequestError('Please provide Event id')
  }
  if(!winner){
    throw new BadRequestError('Please provide Winners')
  }
  const event = await Event.findOneAndUpdate({_id:eid},req.body,{ new: true, runValidators: true })
  let winning=[]
  let flag=0
  for(let i=0;i<winner.length;++i){
    flag=0
    const user = await User.findOne({_id:winner[i]})
    user.winning.forEach((win)=>{
      if(String(win) === String(eid)){
        flag=1
      }
    })
    if(flag==0){
      winning = [...user.winning,eid]
    }
    else{
      winning = [...user.winning]
    }
    const user1 = await User.findOneAndUpdate({_id:winner[i]},{winning},{ new: true, runValidators: true })
  }
  res.status(StatusCodes.OK).json({res:"Success"})

}

const searchUserEmail = async (req,res) => {
  const {search} = req.query;
  const obj={}
  if(search){
    obj.email = {$regex:search,$options:'i'}
  }
  const user = await User.find(obj);
  setTimeout(()=>{
    res.status(StatusCodes.OK).json({ res: "success", data:user });
  },1000)
} 

const showEventOfflineForUser = async (req,res) => {
  const {email} = req.body
  if(!email){
    throw new BadRequestError('Please provide neccesary Credentials')
  }
  const user = await User.findOne({email})
  if(!user){
    throw new BadRequestError('Please provide Valid Username')
  }
  const event = await UserEvent.findOne({userId:user._id,payment_status:'INCOMPLETE',payment_mode:'OFFLINE'})
  if(!event){
    throw new BadRequestError('Please provide Valid Details')
  }
  for(let i=0;i<event.length;++i){
    const response = await Event.findOne({_id:event[i].eventid})
    event[i].name = response.name
  }
  obj={}
  obj.event = event
  const combo = await Combos.find({userId:user._id,payment_status:'INCOMPLETE',payment_mode:'OFFLINE'})
  for(let i=0;i<combo.length;++i){
    let name=[]
    for(let j=0;j<combo[i].event.length;++j){
      const response = await Event.findOne({_id:combo[i].event[j]})
      name.push(response.name)
    }
    combo[i].name = name
  }
  obj.combo = combo
  res.status(StatusCodes.OK).json({res:"Success",data:event})
}

const verifiedOfflineEvent = async(req,res)=>{
  const {name,_id} = req.body
  let points = 0
  if(name == 'COMBO'){
    const response = await Combos.findOneAndUpdate({_id},{payment_status:'COMPLETED'},{ new: true, runValidators: true })
    for(let i=0;i<response.event.length;++i){
      const eventdetails = await Event.findOne({_id:response.event[i]})
      if(eventdetails.category == 'Tech'){
        points+=60
      }
      else if(eventdetails.category == 'NonTech'){
        points+=40
      }
      else if(eventdetails.category == 'Workshop'){
        points+=80
      }
      const participants = [...eventdetails.participants,response.userId]
      eventdetails.participants = participants
      eventdetails.noOfParticipants+=1
      if(eventdetails.noOfParticipants>=eventdetails.maxparticipants){
        eventdetails.isAvailable = false
      }
      const event = await Event.findOneAndUpdate({_id:response.event[i]},eventdetails,{ new: true, runValidators: true })
    }
    const userdetails = await User.findOne({_id:response.userId})
    points+=userdetails.coins
    const user = await User.findOneAndUpdate({_id:response.userId},{coins:points},{ new: true, runValidators: true })
  }
  else if(name=='EVENT'){
    const userevent = await UserEvent.findOneAndUpdate({_id},{payment_status:'COMPLETED'},{ new: true, runValidators: true })
    let points = 0
    if(userevent.category == 'NORMAL'){
      const eventdetails = await Event.findOne({_id:userevent.eventid})
      if(eventdetails.category == 'Tech'){
        points=60
      }
      else if(eventdetails.category == 'NonTech'){
        points=40
      }
      else if(eventdetails.category == 'Workshop'){
        points=80
      }
      const participants = [...eventdetails.participants,userevent.userId]
      eventdetails.participants = participants
      eventdetails.noOfParticipants+=1
      if(eventdetails.noOfParticipants>=eventdetails.maxparticipants){
        eventdetails.isAvailable = false
      }
      const updatedevent = await Event.findOneAndUpdate({_id:userevent.eventid},eventdetails,{ new: true, runValidators: true })
      const user = await User.findOne({_id:userevent.userId})
      user.coins+=points
      const updateduser = await User.findOneAndUpdate({_id:userevent.userId},user,{ new: true, runValidators: true })
    }
    else if(userevent.category == 'FLAGSHIP'){
      const flagship = await Flagship.findOne({_id:userevent.eventid})
      points = 80
      if(userevent.team){
        //for leader
        let participants = [...flagship.participants,userevent.team['team_leader']]
        flagship.participants = participants
        flagship.noOfParticipants+=1
        const leader = await User.findOne({_id:userevent.team['team_leader']})
        leader.coins+=points
        leader.teams[userevent.eventid] = userevent.team
        const updated_leader = await User.findOneAndUpdate({_id:userevent.team['team_leader']},leader,{ new: true, runValidators: true })
        //for team members
        for(let i=0;i<userevent.team['members'].length;++i){
          let participants = [...flagship.participants,userevent.team['members'][i]]
          flagship.participants = participants
          flagship.noOfParticipants+=1
          const member = await User.findOne({_id:userevent.team['members'][i]})
          member.coins+=points
          member.teams[userevent.eventid] = userevent.team
          const updated_leader = await User.findOneAndUpdate({_id:userevent.team['members'][i]},member,{ new: true, runValidators: true })
        }
        if(flagship.noOfParticipants>=flagship.maxparticipants){
          flagship.isAvailable = false
        }
        const updated_flagship = await Flagship.findOneAndUpdate({_id:userevent.eventid},flagship,{ new: true, runValidators: true })
      }
      else{
        const participants = [...flagship.participants,userevent.userId]
        flagship.participants = participants
        flagship.noOfParticipants+=1
        if(flagship.noOfParticipants>=flagship.maxparticipants){
          flagship.isAvailable = false
        }
        const updatedevent = await Flagship.findOneAndUpdate({_id:userevent.eventid},flagship,{ new: true, runValidators: true })
        const user = await User.findOne({_id:userevent.userId})
        user.coins+=points
        const updateduser = await User.findOneAndUpdate({_id:userevent.userId},user,{ new: true, runValidators: true })
      }
    }
    else if(userevent.category == 'CULTURAL'){
      const cultural = await Cultural.findOne({_id:userevent.eventid})
      points = 60
      if(userevent.team){
        //for leader
        let participants = [...cultural.participants,userevent.team['team_leader']]
        cultural.participants = participants
        cultural.noOfParticipants+=1
        const leader = await User.findOne({_id:userevent.team['team_leader']})
        leader.coins+=points
        leader.teams[userevent.eventid] = userevent.team
        const updated_leader = await User.findOneAndUpdate({_id:userevent.team['team_leader']},leader,{ new: true, runValidators: true })
        //for team members
        for(let i=0;i<userevent.team['members'].length;++i){
          let participants = [...cultural.participants,userevent.team['members'][i]]
          cultural.participants = participants
          cultural.noOfParticipants+=1
          const member = await User.findOne({_id:userevent.team['members'][i]})
          member.coins+=points
          member.teams[userevent.eventid] = userevent.team
          const updated_leader = await User.findOneAndUpdate({_id:userevent.team['members'][i]},member,{ new: true, runValidators: true })
        }
        if(cultural.noOfParticipants>=cultural.maxparticipants){
          cultural.isAvailable = false
        }
        const updated_cultural = await Cultural.findOneAndUpdate({_id:userevent.eventid},cultural,{ new: true, runValidators: true })
      }
      else{
        const participants = [...cultural.participants,userevent.userId]
        cultural.participants = participants
        cultural.noOfParticipants+=1
        if(cultural.noOfParticipants>=cultural.maxparticipants){
          cultural.isAvailable = false
        }
        const updatedevent = await Cultural.findOneAndUpdate({_id:userevent.eventid},cultural,{ new: true, runValidators: true })
        const user = await User.findOne({_id:userevent.userId})
        user.coins+=points
        const updateduser = await User.findOneAndUpdate({_id:userevent.userId},user,{ new: true, runValidators: true })
      }
    }
  }
  res.status(StatusCodes.OK).json({res:"Success"})
}

const rejectOfflineEvent = async(req,res)=>{
  const {name,_id} = req.body
  if(name=='EVENT'){
    const reponse = await UserEvent.findOneAndDelete({_id})
  }
  else if(name=='COMBO'){
    const reponse = await Combos.findOneAndDelete({_id})
  }
  res.status(StatusCodes.OK).json({res:"Success"})
}

const verifyEventOfflineOTP = async (req,res) => {
  const {email,otp} = req.body
  if(!email || !otp){
    throw new BadRequestError('Please provide neccesary Credentials')
  }
  const user = await User.findOne({email})
  if(!user){
    throw new BadRequestError('Please provide Valid Username')
  }
  const event = await UserEvent.findOneAndUpdate({userId:user._id,payment_status:'INCOMPLETE',cashotp:otp,payment_mode:'OFFLINE'},{payment_status:'COMPLETED'},{ new: true, runValidators: true })
  if(!event){
    throw new BadRequestError('Please provide Valid Details')
  }
  const EventDetails = await Event.findOne({_id:event.eventid})
  const participants = [...EventDetails.participants,user._id]
  const eventUpdate = await Event.findOneAndUpdate({_id:event.eventid},{participants,noOfParticipants:participants.length},{ new: true, runValidators: true })
  if(eventUpdate.participants.length >= eventUpdate.maxparticipants){
    const finalEventUpdate = await Event.findOneAndUpdate({_id:event.eventid},{isAvailable:false},{ new: true, runValidators: true })
  }
  res.status(StatusCodes.OK).json({res:"Success"})
}

const showComboOfflineOTP = async (req,res) => {
  const {email,otp} = req.body
  console.log(req.body)
  if(!email || !otp){
    throw new BadRequestError('Please provide neccesary Credentials')
  }
  const user = await User.findOne({email})
  if(!user){
    throw new BadRequestError('Please provide Valid Username')
  }
  const combo = await Combos.findOne({userId:user._id,payment_status:'INCOMPLETE',cashotp:otp,payment_mode:'OFFLINE'})
  if(!combo){
    throw new BadRequestError('Please provide Valid Details')
  }
  res.status(StatusCodes.OK).json({res:"Success",data:combo})
}

const verifyComboOfflineOTP = async (req,res) => {
  const {email,otp} = req.body
  if(!email || !otp){
    throw new BadRequestError('Please provide neccesary Credentials')
  }
  const user = await User.findOne({email})
  if(!user){
    throw new BadRequestError('Please provide Valid Username')
  }
  const combo = await Combos.findOneAndUpdate({userId:user._id,payment_status:'INCOMPLETE',cashotp:otp,payment_mode:'OFFLINE'},{payment_status:'COMPLETED'},{ new: true, runValidators: true })
  if(!combo){
    throw new BadRequestError('Please provide Valid Details')
  }
  for(var i=0;i<combo.event.length;++i){
    const EventDetails = await Event.findOne({_id:combo.event[i]})
    const participants = [...EventDetails.participants,user._id]
    const eventUpdate = await Event.findOneAndUpdate({_id:combo.event[i]},{participants,noOfParticipants:participants.length},{ new: true, runValidators: true })
    if(eventUpdate.participants.length >= eventUpdate.maxparticipants){
      const finalEventUpdate = await Event.findOneAndUpdate({_id:combo.event[i]},{isAvailable:false},{ new: true, runValidators: true })
    }
  }
  
  res.status(StatusCodes.OK).json({res:"Success"})
}

const eventParticipantExcel = async (req,res) => {
  const {eid} = req.params
  if(!eid){
    throw new BadRequestError('Please provide Event id')
  }
  const event = await Event.findOne({ _id:eid });
  if(!event){
    throw new BadRequestError('Please provide Valid event id')
  }
  let arr = [];
  let headerColumns = [
    "Name",
    "Email",
    "Phone Number",
    "Enrollment",
    "Year",
    "Branch",
    "College"
  ];
  for(var i=0;i<event.participants.length;++i){
    let obj={}
    const user = await User.findOne({_id:event.participants[i]})
    obj.name = user?.name;
    obj.email=user?.email;
    obj.phonenumber = user?.phonenumber;
    obj.enrollment = user?.enrolment
    obj.year = user?.year
    obj.branch = user?.branch;
    obj.college = user?.college
    arr.push(obj)
  }
  
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet(event.name+"_participants");
    let colIndex = 1;
    headerColumns.forEach((item) => {
      ws.cell(1, colIndex++).string(item);
    });
    let rowIndex = 2;
    arr.forEach((item) => {
      let columnIndex = 1;
      Object.keys(item).forEach((colName) => {
        ws.cell(rowIndex, columnIndex++).string(item[colName]?.toString());
      });
      rowIndex++;
    });
    wb.write(`./controller/${event.name} participants.xlsx`);
    const file = __dirname + `/${event.name} participants.xlsx`;
    const fileName = path.basename(file);
    const mimeType = mime.getType(file);
    const fileStream = fs.createReadStream(file);
    const url = await uploadImageToS3(`${event.name} participants.xlsx`,fileStream)
    console.log(url)
    res.status(StatusCodes.OK).json({res:"Success",data:url})
}

const eventAttendedExcel = async (req,res) => {
  const {eid} = req.params
  if(!eid){
    throw new BadRequestError('Please provide Event id')
  }
  const event = await Event.findOne({ _id:eid });
  if(!event){
    throw new BadRequestError('Please provide Valid event id')
  }
  let arr = [];
  let headerColumns = [
    "Name",
    "Email",
    "Phone Number",
    "Enrollment",
    "Year",
    "Branch",
    "College"
  ];
  for(var i=0;i<event.attendance.length;++i){
    let obj={}
    const user = await User.findOne({_id:event.attendance[i]})
    obj.name = user?.name;
    obj.email=user?.email;
    obj.phonenumber = user?.phonenumber;
    obj.enrollment = user?.enrolment
    obj.year = user?.year
    obj.branch = user?.branch;
    obj.college = user?.college
    
    arr.push(obj)
  };

    const wb = new xl.Workbook();
    const ws = wb.addWorksheet(event.name+"_attendees");
    let colIndex = 1;
    headerColumns.forEach((item) => {
      ws.cell(1, colIndex++).string(item);
    });
    let rowIndex = 2;
    arr.forEach((item) => {
      let columnIndex = 1;
      Object.keys(item).forEach((colName) => {
        ws.cell(rowIndex, columnIndex++).string(item[colName]?.toString());
      });
      rowIndex++;
    });
    wb.write(`./controller/${event.name} attendees.xlsx`);
    const file = __dirname + `/${event.name} attendees.xlsx`;
    const fileName = path.basename(file);
    const mimeType = mime.getType(file);
    const fileStream = fs.createReadStream(file);
    const url = await uploadImageToS3(`${event.name} attendees.xlsx`,fileStream)
    console.log(url)
    res.status(StatusCodes.OK).json({res:"Success",data:url})
}

const getAllCulturalEvents = async(req,res)=>{
  const cutural = await Cultural.find({})
  res.status(StatusCodes.OK).json({res:"Success"})
}

const getIndividualCulturalEvent = async(req,res)=>{
  const {cid} = req.params
  if(!cid){
    throw new BadRequestError('Please provide Event id')
  }
  const event = await Cultural.findOne({ _id:cid });
  if(!event){
    throw new BadRequestError('Please provide Valid event id')
  }
  const cultural = await Cultural.findOne({_id:cid})
  details = []
  if(cultural.type == 'SOLO'){
    for(let i=0;i<cultural.participants.length;++i){
      const user = await Cultural.findOne({_id:cultural.participants[i]})
      details.push(user)
    }
  }
  else if(cultural.type == 'GROUP'){
    for(let i=0;i<cultural.participants.length;++i){
      
    }
  }
  
  cultural['details'] = details
  res.status(StatusCodes.OK).json({res:"Success",data:cultural})
}

const getParticipantExcel = async(req,res)=>{
  const {cid} = req.params
  if(!cid){
    throw new BadRequestError('Please provide Event id')
  }
  const event = await Cultural.findOne({ _id:cid });
  if(!event){
    throw new BadRequestError('Please provide Valid event id')
  }
  let arr = [];
  let headerColumns = [
    "Name",
    "Email",
    "Phone Number",
    "Enrollment",
    "Year",
    "Branch",
    "College"
  ];
  for(var i=0;i<event.attendance.length;++i){
    let obj={}
    const user = await User.findOne({_id:event.attendance[i]})
    obj.name = user?.name;
    obj.email=user?.email;
    obj.phonenumber = user?.phonenumber;
    obj.enrollment = user?.enrolment
    obj.year = user?.year
    obj.branch = user?.branch;
    obj.college = user?.college
    
    arr.push(obj)
  };

    const wb = new xl.Workbook();
    const ws = wb.addWorksheet(event.name+"_attendees");
    let colIndex = 1;
    headerColumns.forEach((item) => {
      ws.cell(1, colIndex++).string(item);
    });
    let rowIndex = 2;
    arr.forEach((item) => {
      let columnIndex = 1;
      Object.keys(item).forEach((colName) => {
        ws.cell(rowIndex, columnIndex++).string(item[colName]?.toString());
      });
      rowIndex++;
    });
    wb.write(`./controller/${event.name} attendees.xlsx`);
    const file = __dirname + `/${event.name} attendees.xlsx`;
    const fileName = path.basename(file);
    const mimeType = mime.getType(file);
    const fileStream = fs.createReadStream(file);
    const url = await uploadImageToS3(`${event.name} attendees.xlsx`,fileStream)
    console.log(url)
    res.status(StatusCodes.OK).json({res:"Success",data:url})
}

module.exports = {
  eventFetch,participantList,alreadyAttendedUser,updateAttendance,updateEvent,fetchLead,fetchWinners,updateWinners,searchUserEmail,verifyEventOfflineOTP,showEventOfflineForUser,showComboOfflineOTP,verifyComboOfflineOTP,eventParticipantExcel,eventAttendedExcel,verifiedOfflineEvent,rejectOfflineEvent,getAllCulturalEvents,getIndividualCulturalEvent
}
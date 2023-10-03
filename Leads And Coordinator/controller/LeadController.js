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
const stream = require('stream')

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
    const d = new Date();
    let date = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
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
    const d = new Date();
    let date = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
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
      points += user?.coins ?? 0
      user.coins=points
      const updateduser = await User.findOneAndUpdate({_id:userevent.userId},user,{ new: true, runValidators: true })
    }
    else if(userevent.category == 'FLAGSHIP'){
      const flagship = await Flagship.findOne({_id:userevent.eventid})
      points = 80
      if(Object.keys(userevent.team).length != 0){
        //for leader
        const leader = await User.findOne({_id:userevent.team['team_leader']})
        points += leader?.coins ?? 0
        leader.coins=points
        leader.teams[userevent.eventid] = userevent.team
        const updated_leader = await User.findOneAndUpdate({_id:userevent.team['team_leader']},leader,{ new: true, runValidators: true })
        //for team members
        for(let i=0;i<userevent.team['members'].length;++i){
          const member = await User.findOne({_id:userevent.team['members'][i]})
          points += member?.coins ?? 0
          member.coins=points
          member.teams[userevent.eventid] = userevent.team
          const updated_leader = await User.findOneAndUpdate({_id:userevent.team['members'][i]},member,{ new: true, runValidators: true })
        }
        let participants = [...flagship.participants,userevent.team]
        flagship.participants = participants
        flagship.noOfParticipants += userevent.team['members'].length + 1
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
        points += user?.coins ?? 0
        user.coins=points
        const updateduser = await User.findOneAndUpdate({_id:userevent.userId},user,{ new: true, runValidators: true })
      }
    }
    else if(userevent.category == 'CULTURAL'){
      const cultural = await Cultural.findOne({_id:userevent.eventid})
      points = 60
      console.log(Object.keys(userevent.team).length)
      if( Object.keys(userevent.team).length != 0 ){
        //for leader
        const leader = await User.findOne({_id:userevent.team['team_leader']})
        points += leader?.coins ?? 0
        leader.coins=points
        leader.teams[userevent.eventid] = userevent.team
        const updated_leader = await User.findOneAndUpdate({_id:userevent.team['team_leader']},leader,{ new: true, runValidators: true })
        //for team members
        for(let i=0;i<userevent.team['members'].length;++i){
          const member = await User.findOne({_id:userevent.team['members'][i]})
          points += member?.coins ?? 0
          member.coins=points
          member.teams[userevent.eventid] = userevent.team
          const updated_leader = await User.findOneAndUpdate({_id:userevent.team['members'][i]},member,{ new: true, runValidators: true })
        }
        let participants = [...cultural.participants,userevent.team]
        cultural.participants = participants
        cultural.noOfParticipants += userevent.team['members'].length + 1
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
        console.log(updatedevent)
        const user = await User.findOne({_id:userevent.userId})
        points += user?.coins ?? 0
        user.coins=points
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
    const buffer = await wb.writeToBuffer();
    const base64String = buffer.toString('base64');
    url = await uploadImageToS3(`${event.name} participants.xlsx`, base64String);
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
    const buffer = await wb.writeToBuffer();
    const base64String = buffer.toString('base64');
    url = await uploadImageToS3(`${event.name} participants.xlsx`, base64String);
    console.log(url)
    res.status(StatusCodes.OK).json({res:"Success",data:url})
}

const getAllCulturalEvents = async(req,res)=>{
  const cutural = await Cultural.find({})
  res.status(StatusCodes.OK).json({res:"Success",data:cutural})
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
  let culture = await Cultural.findOne({_id:cid})
  details = []
  let cultural = JSON.parse(JSON.stringify(culture)); 
  if(cultural.type == 'SOLO'){
    for(let i=0;i<cultural.participants.length;++i){
      const user = await User.findOne({_id:cultural.participants[i]})
      details.push(user)
    }
    cultural['details'] = details
  }
  else if(cultural.type == 'GROUP'){
    let arr = []
    for(let i=0;i<cultural.participants.length;++i){
      arr=[]
      const leader = await User.findOne({_id:cultural.participants[i]['team_leader']})
      cultural.participants[i]['team_leader_details'] = leader
      for(let j=0;j<cultural.participants[i]['members'].length;++j){
        const leader = await User.findOne({_id:cultural.participants[i]['members'][j]})
        arr.push(leader)
      }
      cultural.participants[i]['team_members_details'] = arr
    }
  }
  
  res.status(StatusCodes.OK).json({res:"Success",data:cultural})
}


const getCulturalParticipantExcel = async(req,res)=>{
  const {cid} = req.params
  if(!cid){
    throw new BadRequestError('Please provide Event id')
  }
  const event = await Cultural.findOne({ _id:cid });
  if(!event){
    throw new BadRequestError('Please provide Valid event id')
  }
  let url = ''
  if(event.type == 'GROUP'){
    let arr = [];
  let headerColumns = [
    "Team Name",
    "Leader Name",
    "Leader Branch",
    "Leader phone number",
    "Leader Year",
    "Leader Email",
    "Number of participants",
    "Participant 1 name",
    "Participant 1 Branch",
    "Participant 1 Phone number",
    "Participant 2 name",
    "Participant 2 Branch",
    "Participant 2 Phone number",
    "Participant 3 name",
    "Participant 3 Branch",
    "Participant 3 Phone number",
    "Participant 4 name",
    "Participant 4 Branch",
    "Participant 4 Phone number",
    "Participant 5 name",
    "Participant 5 Branch",
    "Participant 5 Phone number"
  ];
  for(var i=0;i<event.participants.length;++i){
    let obj={}
    const user = await User.findOne({_id:event.participants[i]['team_leader']})
    obj.teamname = event.participants[i]?.team_name;
    obj.leadername=user?.name;
    obj.leaderbranch = user?.branch
    obj.leaderphonenumber = user?.phonenumber;
    obj.leaderyear = user?.year
    obj.leaderemail = user?.email
    obj.numberofparticipants = 1 + event.participants[i]['members'].length
    for(let j=0;j<event.participants[i]['members'].length;++j){
      const member = await User.findOne({_id:event.participants[i]['members'][j]})
      obj[`member_name_${j+1}`] = member?.name
      obj[`member_branch_${j+1}`] = member?.branch
      obj[`member_phone_number_${j+1}`] = member?.phonenumber
    }
    arr.push(obj)
  };

    const wb = new xl.Workbook();
    const ws = wb.addWorksheet(event.name+"_participants");
    let colIndex = 1;
    
    for(let i=0;i<headerColumns.length;++i){
      ws.cell(1, colIndex++).string(headerColumns[i]);
    }
    let rowIndex = 2;

    for(let i=0;i<arr.length;++i){
      let columnIndex = 1
      for(let j=0;j<Object.keys(arr[i]).length;++j){
        ws.cell(rowIndex, columnIndex++).string(arr[i][Object.keys(arr[i])[j]]?.toString());
      }
    }
    
    const buffer = await wb.writeToBuffer();
    const base64String = buffer.toString('base64');
    url = await uploadImageToS3(`${event.name} participants.xlsx`, base64String);
    console.log(url)
  }
  else if(event.type == 'SOLO'){
    let arr = [];
  let headerColumns = [
    "Name",
    "Branch",
    "Year",
    "Enrollment",
    "Phone Number",
    "Email"
  ];
  for(var i=0;i<event.participants.length;++i){
    let obj={}
    const user = await User.findOne({_id:event.participants[i]})
    obj.name=user?.name;
    obj.branch = user?.branch
    obj.year = user?.year
    obj.enrollment = user?.enrolment
    obj.phonenumber = user?.phonenumber;
    obj.email = user?.email
    arr.push(obj)
  };

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
    const buffer = await wb.writeToBuffer();
    const base64String = buffer.toString('base64');
    url = await uploadImageToS3(`${event.name} participants.xlsx`, base64String);
    console.log(url)
  }
  res.status(StatusCodes.OK).json({res:"Success",data:url})
}

const getIdeathonEvents = async(req,res)=>{
  const response = await Flagship.find({category:'Ideathon'})
  res.status(StatusCodes.OK).json({res:"Success",data:response})
}

const getIndividualFlagshipEvent = async(req,res)=>{
  const {fid} = req.params
  const respond = await Flagship.findOne({_id:fid})
  const response = JSON.parse(JSON.stringify(respond))
  if(response.type == 'SOLO'){
    for(let i=0;i<response.participants.length;++i){
      const user = await User.findOne({_id:response.participants[i]})
      details.push(user)
    }
    response['details'] = details
  }
  else if(response.type == 'GROUP'){
    let arr=[]
    for(let i=0;i<response.participants.length;++i){
      arr=[]
      const leader = await User.findOne({_id:response.participants[i]['team_leader']})
      response.participants[i]['team_leader_details'] = leader
      for(let j=0;j<response.participants[i]['members'].length;++j){
        const leader = await User.findOne({_id:response.participants[i]['members'][j]})
        arr.push(leader)
      }
      response.participants[i]['team_members_details'] = arr
    }
  }
  res.status(StatusCodes.OK).json({res:"Success"})
}

const getFlagshipAttendance = async(req,res)=>{
  const {fid} = req.params
  const getattendance = await Flagship.findOne({_id:fid})
  response.status(StatusCodes.OK).json({res:"Success",data:getattendance.attendance})
}

const setFlagshipAttendance = async(req,res)=>{
  const {fid} = req.params
  const {attendance} = req.body
  const updateattendance = await Flagship.findOneAndUpdate({_id:fid},{attendance},{ new: true, runValidators: true })
  response.status(StatusCodes.OK).json({res:"Success"})
}

const getFlagshipParticipantExcel = async(req,res)=>{
  const {fid} = req.params
  if(!fid){
    throw new BadRequestError('Please provide Event id')
  }
  const event = await Flagship.findOne({ _id:fid });
  if(!event){
    throw new BadRequestError('Please provide Valid event id')
  }
  let url = ''
  if(event.type == 'GROUP'){
    let arr = [];
  let headerColumns = [
    "Team Name",
    "Leader Name",
    "Leader Branch",
    "Leader phone number",
    "Leader Year",
    "Leader Email",
    "Number of participants",
    "Participant 1 name",
    "Participant 1 Branch",
    "Participant 1 Phone number",
    "Participant 2 name",
    "Participant 2 Branch",
    "Participant 2 Phone number",
    "Participant 3 name",
    "Participant 3 Branch",
    "Participant 3 Phone number",
    "Participant 4 name",
    "Participant 4 Branch",
    "Participant 4 Phone number",
    "Participant 5 name",
    "Participant 5 Branch",
    "Participant 5 Phone number"
  ];
  for(var i=0;i<event.participants.length;++i){
    let obj={}
    const user = await User.findOne({_id:event.participants[i]['team_leader']})
    obj.teamname = event.participants[i]?.team_name;
    obj.leadername=user?.name;
    obj.leaderbranch = user?.branch
    obj.leaderphonenumber = user?.phonenumber;
    obj.leaderyear = user?.year
    obj.leaderemail = user?.email
    obj.numberofparticipants = 1 + event.participants[i]['members'].length
    for(let j=0;j<event.participants[i]['members'].length;++j){
      const member = await User.findOne({_id:event.participants[i]['members'][j]})
      obj[`member_name_${j+1}`] = member?.name
      obj[`member_branch_${j+1}`] = member?.branch
      obj[`member_phone_number_${j+1}`] = member?.phonenumber
    }
    arr.push(obj)
  };

    const wb = new xl.Workbook();
    const ws = wb.addWorksheet(event.name+"_participants");
    let colIndex = 1;
    
    for(let i=0;i<headerColumns.length;++i){
      ws.cell(1, colIndex++).string(headerColumns[i]);
    }
    let rowIndex = 2;

    for(let i=0;i<arr.length;++i){
      let columnIndex = 1
      for(let j=0;j<Object.keys(arr[i]).length;++j){
        ws.cell(rowIndex, columnIndex++).string(arr[i][Object.keys(arr[i])[j]]?.toString());
      }
    }
    
    const buffer = await wb.writeToBuffer();
    const base64String = buffer.toString('base64');
    url = await uploadImageToS3(`${event.name} participants.xlsx`, base64String);
    console.log(url)
  }
  else if(event.type == 'SOLO'){
    let arr = [];
  let headerColumns = [
    "Name",
    "Branch",
    "Year",
    "Enrollment",
    "Phone Number",
    "Email"
  ];
  for(var i=0;i<event.participants.length;++i){
    let obj={}
    const user = await User.findOne({_id:event.participants[i]})
    obj.name=user?.name;
    obj.branch = user?.branch
    obj.year = user?.year
    obj.enrollment = user?.enrolment
    obj.phonenumber = user?.phonenumber;
    obj.email = user?.email
    arr.push(obj)
  };

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
    const buffer = await wb.writeToBuffer();
    const base64String = buffer.toString('base64');
    url = await uploadImageToS3(`${event.name} participants.xlsx`, base64String);
    console.log(url)
  }
  res.status(StatusCodes.OK).json({res:"Success",data:url})
}

const getFlagshipAttendanceExcel = async(req,res)=>{
  const {fid} = req.params
  if(!fid){
    throw new BadRequestError('Please provide Event id')
  }
  const event = await Flagship.findOne({ _id:fid });
  if(!event){
    throw new BadRequestError('Please provide Valid event id')
  }
  let url = ''
  if(event.type == 'GROUP'){
    let arr = [];
  let headerColumns = [
    "Team Name",
    "Leader Name",
    "Leader Branch",
    "Leader phone number",
    "Leader Year",
    "Leader Email",
    "Number of participants",
    "Participant 1 name",
    "Participant 1 Branch",
    "Participant 1 Phone number",
    "Participant 2 name",
    "Participant 2 Branch",
    "Participant 2 Phone number",
    "Participant 3 name",
    "Participant 3 Branch",
    "Participant 3 Phone number",
    "Participant 4 name",
    "Participant 4 Branch",
    "Participant 4 Phone number",
    "Participant 5 name",
    "Participant 5 Branch",
    "Participant 5 Phone number"
  ];
  for(var i=0;i<event.attendance.length;++i){
    let obj={}
    const user = await User.findOne({_id:event.attendance[i]['team_leader']})
    obj.teamname = event.attendance[i]?.team_name;
    obj.leadername=user?.name;
    obj.leaderbranch = user?.branch
    obj.leaderphonenumber = user?.phonenumber;
    obj.leaderyear = user?.year
    obj.leaderemail = user?.email
    obj.numberofparticipants = 1 + event.attendance[i]['members'].length
    for(let j=0;j<event.attendance[i]['members'].length;++j){
      const member = await User.findOne({_id:event.attendance[i]['members'][j]})
      obj[`member_name_${j+1}`] = member?.name
      obj[`member_branch_${j+1}`] = member?.branch
      obj[`member_phone_number_${j+1}`] = member?.phonenumber
    }
    arr.push(obj)
  };

    const wb = new xl.Workbook();
    const ws = wb.addWorksheet(event.name+"_attendance");
    let colIndex = 1;
    
    for(let i=0;i<headerColumns.length;++i){
      ws.cell(1, colIndex++).string(headerColumns[i]);
    }
    let rowIndex = 2;

    for(let i=0;i<arr.length;++i){
      let columnIndex = 1
      for(let j=0;j<Object.keys(arr[i]).length;++j){
        ws.cell(rowIndex, columnIndex++).string(arr[i][Object.keys(arr[i])[j]]?.toString());
      }
    }
    
    const buffer = await wb.writeToBuffer();
    const base64String = buffer.toString('base64');
    url = await uploadImageToS3(`${event.name} attendance.xlsx`, base64String);
    console.log(url)
  }
  else if(event.type == 'SOLO'){
    let arr = [];
  let headerColumns = [
    "Name",
    "Branch",
    "Year",
    "Enrollment",
    "Phone Number",
    "Email"
  ];
  for(var i=0;i<event.attendance.length;++i){
    let obj={}
    const user = await User.findOne({_id:event.attendance[i]})
    obj.name=user?.name;
    obj.branch = user?.branch
    obj.year = user?.year
    obj.enrollment = user?.enrolment
    obj.phonenumber = user?.phonenumber;
    obj.email = user?.email
    arr.push(obj)
  };

    const wb = new xl.Workbook();
    const ws = wb.addWorksheet(event.name+"_attendance");
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
    const buffer = await wb.writeToBuffer();
    const base64String = buffer.toString('base64');
    url = await uploadImageToS3(`${event.name} attendance.xlsx`, base64String);
    console.log(url)
  }
  res.status(StatusCodes.OK).json({res:"Success",data:url})
}

const getToyothonEvents = async(req,res)=>{
  const response = await Flagship.find({category:'Toyothon'})
  res.status(StatusCodes.OK).json({res:"Success",data:response})
}

const getUserDetails = async(req,res)=>{
  const {uid} = req.params
  const user = await User.findOne({_id:uid})
  res.status(StatusCodes.OK).json({res:"Success",data:user})
}

const reduceToken = async(req,res)=>{
  const {uid} = req.params
  const user = await User.findOne({_id:uid})
  if(user.tokens == 0){
    throw new BadRequestError("This user is not having any token")
  }
  user.tokens = user.tokens - 1
  const updatedtoken = await User.findOneAndUpdate({_id:uid},user,{ new: true, runValidators: true })
  res.status(StatusCodes.OK).json({res:"Success"})
}

const getAllIncompleteUsersOnline = async(req,res) => {
  const user_event = await UserEvent.find({payment_status:'INCOMPLETE',payment_mode:'ONLINE'})
  const userevent = JSON.parse(JSON.stringify(user_event))
  for(let i=0;i<userevent.length;++i){
    const user = await User.findOne({_id:userevent[i].userId})
    userevent[i]['user_detail'] = user
    if(userevent[i].category == 'NORMAL'){
      const event = await Event.findOne({_id:userevent[i].eventid})
      userevent[i]['event_details'] = event
    }
    else if(userevent[i].category == 'FLAGSHIP'){
      const event = await Flagship.findOne({_id:userevent[i].eventid})
      userevent[i]['event_details'] = event
    }
    else if(userevent[i].category == 'CULTURAL'){
      const event = await Cultural.findOne({_id:userevent[i].eventid})
      userevent[i]['event_details'] = event
    }
  }
  let obj = {}
  obj['event'] = userevent
  const combo = await Combos.find({payment_status:'INCOMPLETE',payment_mode:'ONLINE'})
  const combos = JSON.parse(JSON.stringify(combo))
  for(let i=0;i<combos.length;++i){
    const user = await User.findOne({_id:combos[i].userId})
    combos[i]['user_details'] = user
    let events = []
    for(let j=0;j<combos[i].event.length;++j){
      const event = await Event.findOne({_id:combos[i].event[j]})
      events.push(event)
    }
    combos[i]['event_details'] = events
  }
  obj['combos'] = combos
  res.status(StatusCodes.OK).json({res:"Success",data:obj})
}

const acceptOnlinePayment = async(req,res)=>{
  const {eid} = req.params
  const userevent = await UserEvent.findOneAndUpdate({_id:eid},{payment_status:'COMPLETED'},{ new: true, runValidators: true })
  const combos = await Combos.findOneAndUpdate({_id:eid},{payment_status:'COMPLETED'},{ new: true, runValidators: true })
  res.status(StatusCodes.OK).json({res:"Success"})
}

module.exports = {
  eventFetch,participantList,alreadyAttendedUser,updateAttendance,updateEvent,fetchLead,fetchWinners,updateWinners,searchUserEmail,verifyEventOfflineOTP,showEventOfflineForUser,showComboOfflineOTP,verifyComboOfflineOTP,eventParticipantExcel,eventAttendedExcel,verifiedOfflineEvent,rejectOfflineEvent,getAllCulturalEvents,getIndividualCulturalEvent,getCulturalParticipantExcel,getIdeathonEvents,getIndividualFlagshipEvent,getFlagshipAttendance,setFlagshipAttendance,getFlagshipParticipantExcel,getFlagshipAttendanceExcel,getToyothonEvents,getUserDetails,reduceToken,getAllIncompleteUsersOnline,acceptOnlinePayment
}
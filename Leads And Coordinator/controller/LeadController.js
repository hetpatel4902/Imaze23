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

const showEventOfflineOTP = async (req,res) => {
  const {email,otp} = req.body
  if(!email || !otp){
    throw new BadRequestError('Please provide neccesary Credentials')
  }
  const user = await User.findOne({email})
  if(!user){
    throw new BadRequestError('Please provide Valid Username')
  }
  const event = await UserEvent.findOne({userId:user._id,payment_status:'INCOMPLETE',cashotp:otp,payment_mode:'OFFLINE'})
  if(!event){
    throw new BadRequestError('Please provide Valid Details')
  }
  const EventDetails = await Event.findOne({_id:event.eventid})
  res.status(StatusCodes.OK).json({res:"Success",data:EventDetails})
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
  const eventUpdate = await Event.findOneAndUpdate({_id:event.eventid},{participants},{ new: true, runValidators: true })
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
  combo.event.forEach(async(cb)=>{
    
  })
  for(var i=0;i<combo.event.length;++i){
    const EventDetails = await Event.findOne({_id:combo.event[i]})
    const participants = [...EventDetails.participants,user._id]
    const eventUpdate = await Event.findOneAndUpdate({_id:combo.event[i]},{participants},{ new: true, runValidators: true })
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
    "College",
    "Phone Number",
    "Purchase_Type",
    "Payment_Mode"
  ];
  for(var i=0;i<event.participants.length;++i){
    let obj={}
    const user = await User.findOne({_id:event.participants[i]})
    obj.name = user.name;
    obj.email=user.email;
    obj.college = user.college;
    obj.phonenumber = user.phonenumber;
    const userevent = await UserEvent.findOne({userId:event.participants[i],eventid:eid})
      if(userevent){
        obj.purchasetype = 'EVENT'
        obj.paymentmode = userevent.payment_mode
      }
      else{
        const combos = await Combos.find({userId:event.participants[i]})
        combos.forEach((combo)=>{
          combo.event.forEach((comb)=>{
            if(String(comb) === String(eid)){
              obj.purchasetype = combo.combotype+'_COMBO'
              obj.paymentmode = combo.payment_mode
            }
          })
        })
      }
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
    res.setHeader("Content-Disposition", "attachment;filename=" + fileName);
    res.setHeader("Content-Type", mimeType);
    setTimeout(() => {
      res.download(file);
    }, 2000);
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
    "College",
    "Phone Number",
    "Purchase_Type",
    "Payment_Mode"
  ];
  for(var i=0;i<event.attendance.length;++i){
    let obj={}
    const user = await User.findOne({_id:event.attendance[i]})
    obj.name = user.name;
    obj.email=user.email;
    obj.college = user.college;
    obj.phonenumber = user.phonenumber;
    const userevent = await UserEvent.findOne({userId:event.attendance[i],eventid:eid})
      if(userevent){
        obj.purchasetype = 'EVENT'
        obj.paymentmode = userevent.payment_mode
      }
      else{
        const combos = await Combos.find({userId:event.attendance[i]})
        combos.forEach((combo)=>{
          combo.event.forEach((comb)=>{
            if(String(comb) === String(eid)){
              obj.purchasetype = combo.combotype+'_COMBO'
              obj.paymentmode = combo.payment_mode
            }
          })
        })
      }
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
    res.setHeader("Content-Disposition", "attachment;filename=" + fileName);
    res.setHeader("Content-Type", mimeType);
    setTimeout(() => {
      res.download(file);
    }, 2000);
}
module.exports = {
  eventFetch,participantList,alreadyAttendedUser,updateAttendance,updateEvent,fetchLead,fetchWinners,updateWinners,searchUserEmail,verifyEventOfflineOTP,showEventOfflineOTP,showComboOfflineOTP,verifyComboOfflineOTP,eventParticipantExcel,eventAttendedExcel
}
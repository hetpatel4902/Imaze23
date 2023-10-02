const express = require("express");
const app=express();
const Coordinator = require('../models/Coordinator')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError,UnauthenticatedError} = require('../errors/index')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const Announcement = require('../models/Announcements')
const Event = require('../models/Event')

const addAnnouncement = async (req,res) => {
  const {description} = req.body
  if(!description){
    throw new BadRequestError('Please provide announcement')
  }
  const announcement = await Announcement.create(req.body)
  res.status(StatusCodes.OK).json({res:'Success',data:announcement})
}

const fetchAllAnnouncements = async (req,res) => {
  const announcements = await Announcement.find({})
  res.status(StatusCodes.OK).json({res:'Success',data:announcements})
}

const searchEvent = async (req,res) => {
    const {search} = req.query;
    const obj={}
    if(search){
      obj.name = {$regex:search,$options:'i'}
    }
    const event = await Event.find(obj);
    setTimeout(()=>{
      res.status(StatusCodes.OK).json({ res: "success", data:event });
    },1000)
  
}

module.exports = {
  addAnnouncement,fetchAllAnnouncements,searchEvent
}
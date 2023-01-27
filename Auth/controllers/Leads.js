const express = require("express");
const app=express();
const Lead = require('../models/Leads')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError,UnauthenticatedError} = require('../errors/index')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const registerLeads = async (req,res) => {
  const {name,email,password}=req.body
   if(!email || !name || !password ){
     throw new BadRequestError('Please provide necessary credentials')
   }
  const lead = await Lead.create(req.body)
  const token = lead.createJWT()
  res.status(StatusCodes.CREATED).json({lead:{name:lead.name,id:lead._id},token})
}

const loginLeads = async (req,res) => {
  const {email,password} = req.body
  if(!email || !password){
    throw new BadRequestError('Please provide email and password')
  }
  const lead = await Lead.findOne({email})
  if(!lead){
    throw new UnauthenticatedError('Invalid Credentials')
  }
  const isPasswordCorrect = await lead.comparePassword(password)
  if(!isPasswordCorrect){
    throw new UnauthenticatedError('Invalid Credentials')
  }
  const token = lead.createJWT()
  res.status(StatusCodes.CREATED).json({lead:{name:lead.name,id:lead._id},token})
}

module.exports = {
  registerLeads,loginLeads
}
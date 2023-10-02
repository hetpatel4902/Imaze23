const express = require("express");
const app=express();
const Coordinator = require('../models/Coordinator')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError,UnauthenticatedError} = require('../errors/index')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');

const registerCoordinator = async (req,res) => {
  const {email,password}=req.body
   if(!email || !password ){
     throw new BadRequestError('Please provide necessary credentials')
   }
  const coordinator = await Coordinator.create(req.body)
  const token = coordinator.createJWT()
  res.status(StatusCodes.CREATED).json({coordinator:{id:coordinator._id},token})
}

const loginCoordinator = async (req,res) => {
  const {email,password} = req.body
  if(!email || !password){
    throw new BadRequestError('Please provide email and password')
  }
  const coordinator = await Coordinator.findOne({email})
  if(!coordinator){
    throw new UnauthenticatedError('Invalid Credentials')
  }
  const isPasswordCorrect = await coordinator.comparePassword(password)
  if(!isPasswordCorrect){
    throw new UnauthenticatedError('Invalid Credentials')
  }
  const token = coordinator.createJWT()
  res.status(StatusCodes.CREATED).json({coordinator:{id:coordinator._id},token})
}

module.exports = {
  registerCoordinator,loginCoordinator
}
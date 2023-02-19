const User = require("../models/Users");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors/index");

const validateUserOtp = async(req,res)=>{
  const {otp} = req.body;
  const {uid} = req.params;
  if(!otp)
  {
    throw new BadRequestError('Please provide otp in the body');
  }
  const user = await User.findOne({_id:uid});
  if(user.otp !== otp)
  {
    res.status(StatusCodes.OK).json({res:"failed",data:"Invalid otp"});
  }
  else
  {
    res.status(StatusCodes.Ok).json({res:"success",data:"valid otp"});
  }
}



module.exports = {
  getAllEvents,
  getOneEvent,
  getEventsCategorized,
  getUserEvents,
  getStaticCombos,
  checkDynamicCombo,
  buttonVisibility,
  getCertificate,
  getUserDetails,
  validateUserOtp,
};

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const UsersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide valid email",
    ],
    unique: true,
  },
  enrolment:{
    type:Number,
    required:[true,"Please provide enrolment number"],
    unique:[true,"This enrolment has already registered!"]
  },
  college: {
    type: String,
    required: [true, "Please provide college name"],
  },
  year:{
    type:Number,
    enum:[1,2,3,4],
    required:[true,"Please provide the year"]
  },
  branch:{
    type:String,
    required:[true,"Please provide the branch of the student"]
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 8,
  },
  phonenumber: {
    type: String,
    required: [true, "Please provide valid Number"],
  },
  coins: {
    type: Number,
    default: 0,
  },
  tokens:{//happy street tokens
    type:Number,
    default :0
  },
  concertToken:{
    type:Number,
    default:0,
    max:1
  },
  otp: {
    type: Number,
    default: 0,
  },
  winning: {
    type: [mongoose.Types.ObjectId],
    default: [],
  },
});

UsersSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UsersSchema.methods.createJWT = function () {
  return jwt.sign({ Id: this._id, name: this.name }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};
UsersSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("Users", UsersSchema);

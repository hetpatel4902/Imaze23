const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: "AKIA6OMT2SWB2LGD3T6Q",
  secretAccessKey: "pRTcUmaztzs32U1dS0iJ9vb1fvxG+c4K6cl3Og3o",
  region: "ap-south-1", // Change to your desired region
});

module.exports = AWS;

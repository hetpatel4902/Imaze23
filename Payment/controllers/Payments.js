require("dotenv").config();
const https = require("https");
const { StatusCodes } = require("http-status-codes");
const PaytmChecksum = require("paytmchecksum");

const getTransactionToken = async (req, res) => {
  const { custId, orderId, amount } = req.body;
  var paytmParams = {};
  paytmParams.body = {
    requestType: "Payment",
    mid: process.env.MID,
    websiteName: "WEBSTAGING",
    orderId: orderId,
    callbackUrl: "/payment/transaction-complete",
    txnAmount: {
      value: amount,
      currency: "INR",
    },
    userInfo: {
      custId: custId,
    },
  };
  const checksum = await PaytmChecksum.generateSignature(
    JSON.stringify(paytmParams.body),
    process.env.MERCHANT_KEY
  );
  paytmParams.head = {
    signature: checksum,
  };
  var post_data = JSON.stringify(paytmParams);

  var options = {
    /* for Staging */
    hostname: "securegw-stage.paytm.in" /* for Production */, // hostname: 'securegw.paytm.in',
    port: 443,
    path: `/theia/api/v1/initiateTransaction?mid=${process.env.MID}&orderId=${orderId}`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": post_data.length,
    },
  };
  var response = "";
  var post_req = https.request(options, function (post_res) {
    post_res.on("data", function (chunk) {
      response += chunk;
    });

    post_res.on("end", function () {
      const token = JSON.parse(response);
      res.status(StatusCodes.OK).json({ res: "succes", data: token });
    });
  });
  post_req.write(post_data);
  post_req.end();
};

const buyEvent = async (req, res) => {
  const {orderId,signature} = req.body;
  const {uid} = req.params;
  var body = { mid: process.env.MID, orderId };
  var paytmChecksum = signature;
  var isVerifySignature = PaytmChecksum.verifySignature(
    body,
    process.env.MERCHANT_KEY,
    paytmChecksum
  );
  if (isVerifySignature) {
    res.status(StatusCodes.OK).json({res:"success",data:"purchase complete"})
    console.log("Checksum Matched");
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({res:"failed",data:"checksum did not match"})
    console.log("Checksum Mismatched");
  }
};

module.exports = { getTransactionToken, buyEvent };

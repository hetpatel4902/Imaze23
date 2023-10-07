// server/utils/s3.js
// const AWS = require("./aws-config");
const AWS = require("../aws-config");
const pdfkit = require("pdfkit");
const fs = require("fs");
const UserEvent = require("../models/UserEvent");
const Combos = require("../models/Combos");
const Cultural = require("../models/Cultural")
const Event  = require("../models/Event");
const FlagshipEvents = require("../models/FlagshipEvents")
const Invoice = require("../models/Invoice")
const Users = require("../models/Users");
const s3 = new AWS.S3();

//excel upload
const uploadImageToS3 = async (name,imageBase64Data) => {
  const base64ImageData = imageBase64Data; // Replace with your actual Base64 data

  // Decode the Base64 data (remove the data:image/jpeg;base64, prefix)
  //const base64Image = base64ImageData.replace(/^data:application\/\w+;base64,/, "");
  const params = {
    Bucket: "imaze-bucket",
    Key: `excel/${name}`,
    Body: Buffer.from(imageBase64Data, "base64"),
    ContentEncoding: "base64",
    ContentType: "application/vnd.ms-excel",
  };

  try {
    const data = await s3.upload(params).promise();
    console.log(data.Location);
    return data.Location; // URL of the uploaded image in S3
  } catch (error) {
    console.error("Error uploading image to S3:", error);
    throw error;
  }
};


//image upload
//type = team or payment or sponser
const uploadImage = async (id, imageBase64Data,type) => {
  const base64ImageData = imageBase64Data; // Replace with your actual Base64 data

  // Decode the Base64 data (remove the data:image/jpeg;base64, prefix)
  const base64Image = base64ImageData.replace(/^data:image\/\w+;base64,/, "");
  const params = {
    Bucket: `imaze-bucket`,
    Key: `user-${type}/${id}.jpg`,
    Body: Buffer.from(base64Image, "base64"),
    ContentEncoding: "base64",
    ContentType: "image/jpeg",
  };

  try {
    const data = await s3.upload(params).promise();
    console.log(data.Location);
    return data.Location; // URL of the uploaded image in S3
  } catch (error) {
    console.error("Error uploading image to S3:", error);
    throw error;
  }
};

const uploadPdf = async(name,stream,type)=>{

  const params = {
    Bucket: `imaze-bucket`,
    Key: `user-${type}/${name}`,
    Body:stream,
    ContentType: "application/pdf",
  };

  try {
    const data = await s3.upload(params).promise();
    console.log(data.Location);
    return data.Location; // URL of the uploaded image in S3
  } catch (error) {
    console.error("Error uploading image to S3:", error);
    throw error;
  }
}

const generateReceipt = async (orderId, type)=>{
  let userId;
  let category;
  let event_ids = [];
  let transId;
  let amount;
  let date;
  let event_type ;
  if (type === "combo") {
    const combo = await Combos.findOne({ _id: orderId });
    transId = combo.transId;
    event_ids = combo.event;
    userId = combo.userId;
    amount = combo.price;
    date = combo.date;
    event_type = "Combo"
    category = "NORMAL";
  }
  if (type === "userevent") {
    const usrevent = await UserEvent.findOne({ _id: orderId });
    transId = usrevent.transId;
    event_ids.push(usrevent.eventid);
    userId = usrevent.userId;
    amount = usrevent.price;
    category = usrevent.category;
    event_type = "Single"
    date = usrevent.date;
  }
  const user = await Users.findOne({ _id: userId });

  const doc = new pdfkit({ size: "A7" });
  doc.pipe(fs.createWriteStream(`./receipts/${transId}.pdf`));
  doc.image(`./templates/LetterHead.jpg`, 0, 0, { width: 210, height: 300 });

  //name
  doc
    .fontSize(7)
    .font("./Montserrat/static/Montserrat-Bold.ttf")
    .text(user.name, 5, 70, {
      width: 60,
      height: 20,
      valign: "center",
      align: "center",
    });

  const invoice_num = await Invoice.find({});
  const update_invoice = await Invoice.findOneAndUpdate({_id:invoice_num[0]._id},{number:invoice_num[0].number+1});
  //invoice number
  doc
    .fontSize(7)
    .font("./Montserrat/static/Montserrat-Bold.ttf")
    .text(invoice_num[0].number, 75, 70, {
      width: 60,
      height: 15,
      valign: "center",
      align: "center",
    });

  //invoice total
  doc
    .fontSize(7)
    .font("./Montserrat/static/Montserrat-Bold.ttf")
    .text(`₹ ${amount}`, 150, 70, {
      width: 60,
      height: 15,
      valign: "center",
      align: "center",
    });

  //date of issue
  doc
    .fontSize(7)
    .font("./Montserrat/static/Montserrat-Bold.ttf")
    .text(date, 75, 90, {
      width: 60,
      height: 15,
      valign: "center",
      align: "center",
    });

  
  doc
    .fontSize(7)
    .font("./Montserrat/static/Montserrat-Bold.ttf")
    .text(amount, 165, 120, {
      width: 40,
      height: 20,
      valign: "center",
      align: "center",
    });
  
  doc
    .fontSize(7)
    .font("./Montserrat/static/Montserrat-Bold.ttf")
    .text(event_type, 115, 120, {
      width: 40,
      height: 20,
      valign: "center",
      align: "center",
    });

  for (let i = 0; i < event_ids.length; i++) {
    let event;
    switch (category) {
      case "NORMAL":
        event = await Event.findOne({ _id: event_ids[i] });
        doc
          .fontSize(7)
          .font("./Montserrat/static/Montserrat-Bold.ttf")
          .text(event.name, 5, 120 + 20 * i, {
            width: 110,
            height: 20,
            valign: "center",
            align: "center",
          });
        doc.rect(5, 120 + 20 * i, 110, 20).stroke();
        break;

      case "CULTURAL":
        event = await Cultural.findOne({ _id: event_ids[i] });
        doc
          .fontSize(7)
          .font("./Montserrat/static/Montserrat-Bold.ttf")
          .text(event.name, 5, 120 + 20 * i, {
            width: 110,
            height: 20,
            valign: "center",
            align: "center",
          });
        doc.rect(5, 120 + 20 * i, 110, 20).stroke();
        break;

      case "FLAGSHIP":
        event = await FlagshipEvents.findOne({ _id: event_ids[i] });
        doc
          .fontSize(7)
          .font("./Montserrat/static/Montserrat-Bold.ttf")
          .text(event.name, 5, 120 + 20 * i, {
            width: 110,
            height: 20,
            valign: "center",
            align: "center",
          });
        doc.rect(5, 120 + 20 * i, 110, 20).stroke();
        break;
    }
  }
  //table border
  doc.rect(5, 120, 200, 172).stroke();

  //vertical line 1
  doc.moveTo(115, 120).lineTo(115, 260).stroke();
  //vertical line 2
  doc.moveTo(165, 120).lineTo(165, 292).stroke();

  //horizontal line
  doc.moveTo(5, 260).lineTo(205, 260).stroke();

  //note
  if (user.university && user.university !== "CVMU") {
    doc
      .fillColor("red")
      .fontSize(5)
      .font("./Montserrat/static/Montserrat-Bold.ttf")
      .text("Note : 18% GST is applied to all non - CVMU students", 10, 270, {
        width: 95,
        height: 20,
        valign: "center",
        align: "center",
      });
  }

  //total amount
  doc
    .fillColor("black")
    .fontSize(7)
    .font("./Montserrat/static/Montserrat-Bold.ttf")
    .text(`₹ ${amount}`, 170, 273, {
      width: 30,
      height: 10,
      valign: "center",
      align: "center",
    });

  doc.end();
  setTimeout(async() => {
    try{
      var file = fs.createReadStream(`./receipts/${transId}.pdf`);
      let url = await uploadPdf(`${transId}.pdf`,file,"certificate");
      fs.unlink(`./receipts/${transId}.pdf`,(err)=>{
        if(err) console.log(err);
      })

      if(type === "userevent"){
        const upd = await UserEvent.findOneAndUpdate({_id:orderId},{receipt_url:url});
        return true;
      }
      if(type === "combo"){
        const upd = await Combos.findOneAndUpdate({_id:orderId},{receipt_url:url});
        return true;

      }
    }
    catch(err){
      console.log("certificate upload error",err);
      return false;
    }
  }, 1000);
}

module.exports = {
  uploadImageToS3,
  uploadImage,
  uploadPdf,
  generateReceipt
};

// server/utils/s3.js
// const AWS = require("./aws-config");
const AWS = require("../aws-config");

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
//type = team or payment
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

module.exports = {
  uploadImageToS3,
  uploadImage
};

// server/utils/s3.js
// const AWS = require("./aws-config");
const AWS = require("../aws-config");

const s3 = new AWS.S3();

const uploadImageToS3 = async (name,imageBase64Data) => {
  const base64ImageData = imageBase64Data; // Replace with your actual Base64 data

  // Decode the Base64 data (remove the data:image/jpeg;base64, prefix)
  //const base64Image = base64ImageData.replace(/^data:application\/\w+;base64,/, "");
  const params = {
    Bucket: "imaze-bucket",
    Key: `excel/${name}`,
    Body: imageBase64Data,
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

module.exports = {
  uploadImageToS3,
};

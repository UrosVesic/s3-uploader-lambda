const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { format } = require("date-fns");

const s3 = new S3Client({
  region: "eu-central-1",
});

const BUCKET_NAME = "bills-123";

// Generate file name based on current date
const generateFileName = () => {
  const now = new Date();
  const year = format(now, "yyyy");
  const month = format(now, "MM");
  const day = format(now, "dd");
  const time = format(now, "HH-mm-ss");
  return `${year}/${month}/${day}/${time}.jpeg`;
};

// Upload file to S3
const uploadFile = async (fileBuffer, fileName) => {
  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: "image/jpeg", // Adjust based on your file type
  };

  await s3.send(new PutObjectCommand(uploadParams));
};

module.exports = {
  generateFileName,
  uploadFile,
};

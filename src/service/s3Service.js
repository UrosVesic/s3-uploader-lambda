const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { format } = require("date-fns");

const s3 = new S3Client({
  region: "eu-central-1",
});

const BUCKET_NAME = "bills-123";

const EXTENSION_BY_MIME = {
  "image/jpeg": "jpeg",
  "image/jpg": "jpeg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
};

// Generate file name based on current date, scoped under the owning user's id
// so downstream consumers (SQS -> processing Lambda) can recover the owner
// straight from the S3 key.
const generateFileName = (userId, contentType) => {
  const now = new Date();
  const year = format(now, "yyyy");
  const month = format(now, "MM");
  const day = format(now, "dd");
  const time = format(now, "HH-mm-ss-SSS");
  const extension = EXTENSION_BY_MIME[contentType] || "jpeg";
  return `${userId}/${year}/${month}/${day}/${time}.${extension}`;
};

// Upload file to S3
const uploadFile = async (fileBuffer, fileName, contentType, userId) => {
  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType || "image/jpeg",
    Metadata: {
      "user-id": userId,
    },
  };

  await s3.send(new PutObjectCommand(uploadParams));
};

module.exports = {
  generateFileName,
  uploadFile,
};

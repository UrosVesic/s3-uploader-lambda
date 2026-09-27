const telegramService = require("../service/telegramService");
const s3Service = require("../service/s3Service");

const handleTelegramPhoto = async (req) => {
  try {
    console.log("Handling photo:", req);
    const fileId = req.message.photo[req.message.photo.length - 1].file_id;
    const filePath = await telegramService.getFilePath(fileId);
    const fileBuffer = await telegramService.downloadFile(filePath);

    // Generate file name
    const fileName = s3Service.generateFileName();

    // Upload to S3
    await s3Service.uploadFile(fileBuffer, fileName);

    console.log(`File uploaded successfully: ${fileName}`);
  } catch (error) {
    console.error("Error handling photo:", error);
    throw error;
  }
};

module.exports = {
  handleTelegramPhoto,
};

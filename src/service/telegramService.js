const axios = require("axios");
const botApiUrl = `https://api.telegram.org`;

const getFilePath = async (fileId) => {
  const fileResponse = await axios.get(
    `${botApiUrl}/bot${process.env.TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`
  );
  return fileResponse.data.result.file_path;
};

const downloadFile = async (filePath) => {
  const downloadUrl = `${botApiUrl}/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${filePath}`;
  const response = await axios({
    url: downloadUrl,
    responseType: "arraybuffer",
  });
  return Buffer.from(response.data);
};

module.exports = {
  getFilePath,
  downloadFile,
};

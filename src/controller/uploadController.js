const s3Service = require("../service/s3Service");

const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
];

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

class ValidationError extends Error {}

// Accepts either a raw base64 string or a data URL (data:image/png;base64,....)
const parseBase64Image = (image, declaredContentType) => {
  const dataUrlMatch = /^data:(.+);base64,(.*)$/.exec(image || "");

  const contentType = dataUrlMatch ? dataUrlMatch[1] : declaredContentType;
  const base64Data = dataUrlMatch ? dataUrlMatch[2] : image;

  if (!base64Data) {
    throw new ValidationError("Missing image data");
  }

  if (!ALLOWED_CONTENT_TYPES.includes(contentType)) {
    throw new ValidationError(`Unsupported content type: ${contentType}`);
  }

  const buffer = Buffer.from(base64Data, "base64");

  if (buffer.length === 0) {
    throw new ValidationError("Empty image data");
  }

  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    throw new ValidationError("Image exceeds maximum allowed size");
  }

  return { buffer, contentType };
};

// Expects req = { image: "<base64 or data URL>", contentType?: "image/jpeg" }
// userId comes from the verified Cognito JWT (API Gateway authorizer), never
// from the request body, so it can't be spoofed by the client.
const handlePhotoUpload = async (req, userId) => {
  if (!userId) {
    throw new ValidationError("Missing authenticated user");
  }

  const { buffer, contentType } = parseBase64Image(req.image, req.contentType);

  const fileName = s3Service.generateFileName(userId, contentType);
  await s3Service.uploadFile(buffer, fileName, contentType, userId);

  return { fileName };
};

module.exports = {
  handlePhotoUpload,
  ValidationError,
};

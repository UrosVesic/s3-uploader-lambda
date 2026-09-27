// Import required packages
require("dotenv").config();
const uploadController = require("./src/controller/uploadController");

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
};

// Cognito authorizer claims land in different places depending on API type:
// - REST API (Lambda/Cognito authorizer): event.requestContext.authorizer.claims.sub
// - HTTP API (JWT authorizer):            event.requestContext.authorizer.jwt.claims.sub
const extractUserId = (event) => {
  const authorizer = event.requestContext && event.requestContext.authorizer;
  if (!authorizer) return undefined;
  return (
    (authorizer.jwt && authorizer.jwt.claims && authorizer.jwt.claims.sub) ||
    (authorizer.claims && authorizer.claims.sub)
  );
};

// Lambda function handler
exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS" || event.requestContext?.http?.method === "OPTIONS") {
    return { statusCode: 204, headers: CORS_HEADERS, body: "" };
  }

  try {
    const userId = extractUserId(event);
    const body = JSON.parse(event.body || "{}");

    const result = await uploadController.handlePhotoUpload(body, userId);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        message: "Photo uploaded successfully",
        fileName: result.fileName,
      }),
    };
  } catch (error) {
    if (error instanceof uploadController.ValidationError) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: error.message }),
      };
    }

    console.error("Error processing photo upload:", error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: "Failed to upload photo" }),
    };
  }
};

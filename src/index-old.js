const express = require("express");
require("dotenv").config();
const uploadController = require("./controller/uploadController");

const PORT = process.env.PORT || 4040;
const app = express();
app.use(express.json({ limit: "20mb" }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.header("Access-Control-Allow-Methods", "POST,OPTIONS");
  next();
});

// Dev-only stand-in for API Gateway's Cognito authorizer, which verifies the
// JWT and populates event.requestContext.authorizer before this code ever
// runs in prod. Locally we just decode the payload without verification.
const extractUserId = (req) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) return undefined;
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString("utf8"));
    return payload.sub;
  } catch {
    return undefined;
  }
};

// Routes
app.post("/upload", async (req, res) => {
  try {
    const result = await uploadController.handlePhotoUpload(req.body, extractUserId(req));
    res.status(200).json({ message: "Photo uploaded successfully", ...result });
  } catch (error) {
    if (error instanceof uploadController.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    console.error("Error processing photo upload:", error);
    res.status(500).json({ message: "Failed to upload photo" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

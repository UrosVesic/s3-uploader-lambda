// Import required packages
require("dotenv").config();
const telegramController = require("./src/controller/telegramController");

// Lambda function handler
exports.handler = async (event) => {
  try {
    // Log the event to understand what data is being passed
    console.log("Received event:", JSON.stringify(event));

    // Assuming event.body contains the raw request body in case of an HTTP POST to Lambda
    const body = JSON.parse(event.body);

    // Call your existing method directly
    await telegramController.handleTelegramPhoto(body);

    // Return a response back to Lambda
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Telegram photo processed successfully",
      }),
    };
  } catch (error) {
    console.error("Error processing telegram photo:", error);
    throw error;
  }
};

const express = require("express");
require("dotenv").config();
const telegramController = require("./controller/telegramController");

const PORT = process.env.PORT || 4040;
const app = express();
app.use(express.json());

// Routes
app.post("*", telegramController.handleTelegramPhoto);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

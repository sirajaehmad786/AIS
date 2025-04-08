require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./config/db");

const app = express();
const userRouter = require("./src/route/user");
const chatRouter = require("./src/route/chat");

app.use(express.json());
app.use(cors());


app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
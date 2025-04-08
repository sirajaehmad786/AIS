const message = require("../../config/message.json");

exports.handleChat = async (req, res) => {
    const { message } = req.body;

  if (!message) {
    return res.status(400).json({ status:false, message: "Message is required" });
  }
  const aiResponse = "AI: Hello, how can I help?";
  return res.status(200).json({ status:true, user: message, data:aiResponse });

};


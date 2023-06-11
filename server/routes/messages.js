const router = require("express").Router();
const { User } = require("../models/user");
const Message = require("../models/message");
const tokenVerification = require("../middleware/tokenVerification");

router.get("/", tokenVerification, async (req, res) => {
  try {
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }],
    })
      .populate("sender", "firstName lastName")
      .populate("recipient", "firstName lastName")
      .sort({ timestamp: -1 });

    res.status(200).send({ data: messages, message: "User messages:" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/user/:userId", tokenVerification, async (req, res) => {
  try {
    const userId = req.params.userId;
    const loggedInUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: loggedInUserId, recipient: userId },
        { sender: userId, recipient: loggedInUserId },
      ],
    })
      .populate("sender", "firstName lastName")
      .populate("recipient", "firstName lastName")
      .sort({ timestamp: -1 });

    res.status(200).send({ data: messages, message: "User messages:" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});


router.post("/:recipientId", tokenVerification, async (req, res) => {
  try {
    const senderId = req.user._id;
    const recipientId = req.params.recipientId;
    const { content } = req.body;

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).send({ message: "Recipient not found" });
    }

    const message = new Message({
      sender: senderId,
      recipient: recipientId,
      content,
    });

    await message.save();

    res.status(200).send({ message: 0 });
  } catch (error) {
    res.status(500).send({ message: 1 });
  }
});

module.exports = router;

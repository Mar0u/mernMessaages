const router = require("express").Router()
const { User, validate } = require("../models/user")
const bcrypt = require("bcrypt")
router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body)
    if (error)
      return res.status(400).send({ message: error.details[0].message })
    const user = await User.findOne({ email: req.body.email })
    if (user)
      return res
        .status(409)
        .send({ message: "User with given email already exist!" })
    const salt = await bcrypt.genSalt(Number(process.env.SALT))
    const hashPassword = await bcrypt.hash(req.body.password, salt)
    await new User({ ...req.body, password: hashPassword }).save()
    res.status(201).send({ message: "User created successfully" })
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" })
  }
})

router.get("/", async (req, res) => {
  User.find().exec()
    .then(async () => {
      const users = await User.find();
      res.status(200).send({ data: users, message: "Lista użytkowników" });
    })
    .catch(error => {
      res.status(500).send({ message: error.message });
    });
})

// delete endpoint
const tokenVerification = require("../middleware/tokenVerification");
router.delete("/", tokenVerification, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.put("/avatar", tokenVerification, async (req, res) => {
  try {
    const userId = req.user._id;
    const avatarLink = req.body.avatarLink;

    const user = await User.findById(userId);

    if (!user) {
      console.log("User not found");
      return res.status(404).send({ message: "User not found" });
    }

    console.log("Before update - Old Avatar Link:", user.avatar);

    user.avatar = avatarLink;
    await user.save();

    console.log("After update - New Avatar Link:", user.avatar);

    res.status(200).send({ message: "Avatar updated successfully" });
  } catch (error) {
    console.log("Error updating avatar:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.put("/email", tokenVerification, async (req, res) => {
  console.log("aaa");
  try {
    const userId = req.user._id;
    const newEmail = req.body.email;

    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      return res.status(409).send({ message: "Email already exists" });
    }

    const user = await User.findById(userId);

    if (!user) {
      console.log("User not found");
      return res.status(404).send({ message: "User not found" });
    }

    console.log("Before update - Old Email:", user.email);

    user.email = newEmail;
    await user.save();

    console.log("After update - New Email:", user.email);

    res.status(200).send({ message: "Email updated successfully" });
  } catch (error) {
    console.log("Error updating email:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  description: { type: String, default: "" },
  favourites: { type: Array, default: [] },
});

const User = mongoose.model("User", userSchema);

const app = express();
const PORT = 5001;
const SECRET_KEY = "skuska";

app.use(bodyParser.json());

app.use(cors());
mongoose
  .connect(
    "mongodb+srv://chymcakLukas:BznHbFtVPaLOB7I6@cluster0.x71zm.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const checkUsername = await User.findOne({ username });
  const hashedPassword = await bcrypt.hash(password, 10);
  if (checkUsername) {
    return res.status(409).send({ message: "User already exists" + username });
  }
  try {
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send({ message: "User created" });
  } catch (err) {
    res.status(409).send({ message: err.message });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).send({ message: "User not found" });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(404).send("Password not valid");

  const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: 86400 });
  res.json({ token });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

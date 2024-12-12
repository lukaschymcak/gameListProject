const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


const app = express();
const PORT = 5000;
const SECRET_KEY = "skuska"

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect("mongodb://localhost:27017/GameList", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favourites: { type: Array, default: [] },
});

const User = mongoose.model("User", userSchema);


app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).send({ message: "User created" });
  } catch (err) {
    res.status(409).send("Email already exists");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if(!user) return res.status(404).send({ message: "User not found" });

const validPassword = await bcrypt.compare(password, user.password);
if(!validPassword) return res.status(404).send("Password not valid");

const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: 86400 });
res.json({ token });
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to our application" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const gameSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  rating: { type: Number, default: 0 },
  platform: { type: String, required: true },
  genre: { type: String, required: true },
  image: { type: String, required: true },
  ownersFinished: { type: Number, default: 0 },
  ownersPlaying: { type: Number, default: 0 },
  ownersPlanToPlay: { type: Number, default: 0 },
});

const profileGameSchema = new mongoose.Schema({
  id: { type: String, required: true },
  image: { type: String, default: "" },
  title: { type: String, required: true },
  state: { type: String, required: true },
  platform: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  description: { type: String, default: "" },
  favoriteGames: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProileGame" }],
  dislikedGames: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProileGame" }],
  currentlyPlaying: [
    { type: mongoose.Schema.Types.ObjectId, ref: "ProileGame" },
  ],
  finishedGames: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProileGame" }],
  planOnPlaying: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProileGame" }],
});

const User = mongoose.model("User", userSchema);
const Game = mongoose.model("Game", gameSchema);
const ProfileGame = mongoose.model("ProfileGame", profileGameSchema);

const app = express();
const PORT = 3000;
const SECRET_KEY = "skuska";

app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

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

app.post("/api/register", async (req, res) => {
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

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).send({ message: "User not found" });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(404).send("Password not valid");

  const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: 86400 });
  res.json({ token });
});

app.get("/api/user", async (req, res) => {
  let token = "";
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
    console.log(token); // The actual token part
  } else {
    console.log("Authorization header is missing or improperly formatted");
  }
  if (!token) return res.status(401).send({ message: "No token provided" });

  jwt.verify(token, SECRET_KEY, async (err, decoded) => {
    if (err) return res.status(401).send({ message: "Unauthorized" });

    const user = await User.findById(decoded._id);

    if (!user) return res.status(404).send({ message: "User not found" });
    res.json(user);
  });
});

app.put("/api/updateUserDescription", async (req, res) => {
  const { description } = req.body;
  let token = verifyToken(req, res);

  jwt.verify(token, SECRET_KEY, async (err, decoded) => {
    if (err) return res.status(401).send({ message: "Unauthorized" });

    const user = await User.findById(decoded._id);

    if (!user) return res.status(404).send({ message: "User not found" });
    user.description = description;
    await user.save();
    res.json(user);
  });
});

app.post("/api/addToFavourites", async (req, res) => {
  let token = verifyToken(req, res);

  jwt.verify(token, SECRET_KEY, async (err, decoded) => {
    if (err) return res.status(401).send({ message: "Unauthorized" });

    const user = await User.findById(decoded._id);
    if (!user) return res.status(404).send({ message: "User not found" });
    user.favoriteGames.push(req.body);
    await user.save();
    res.json(user);
  });
});

app.post("/api/search", async (req, res) => {
  const { title } = req.body;
  console.log(title);
  try {
    const games = await Game.find({
      title: { $regex: `^${title}` },
    })
      .sort({ rating: -1 })
      .limit(10);
    res.json(games);
  } catch (err) {
    res.status(404).send({ message: err.message });
  }
});

function verifyToken(req, res, next) {
  let token = "";
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
    console.log(token); // The actual token part
    return token;
  } else {
    console.log("Authorization header is missing or improperly formatted");
    return "";
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

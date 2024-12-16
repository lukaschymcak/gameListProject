const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const gameSchema = new mongoose.Schema({
  id: { type: String, required: true },
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
  state: { type: String, default: "" },
  platform: { type: String, default: "" },
  cover: { type: Number, default: 0 },
  isCompleted: { type: Boolean, default: false },
  isPlaying: { type: Boolean, default: false },
  isPlanToPlay: { type: Boolean, default: false },
  isFavorite: { type: Boolean, default: false },
  isDisliked: { type: Boolean, default: false },
});

const coverSchema = new mongoose.Schema({
  game: { type: String, required: true },
  height: { type: Number, required: true },
  width: { type: Number, required: true },
  url: { type: String, required: true },
  image_id: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  description: { type: String, default: "" },
  favoriteGames: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProfileGame" }],
  dislikedGames: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProfileGame" }],
  currentlyPlaying: [
    { type: mongoose.Schema.Types.ObjectId, ref: "ProfileGame" },
  ],
  finishedGames: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProfileGame" }],
  planOnPlaying: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProfileGame" }],
});

const User = mongoose.model("User", userSchema);
const Game = mongoose.model("Game", gameSchema);
const Cover = mongoose.model("Cover", coverSchema);
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
    res.json(user);
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

app.put("/api/updateUser", async (req, res) => {
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

app.post("/api/search", async (req, res) => {
  const { title } = req.body;
  let token = verifyToken(req, res);

  jwt.verify(token, SECRET_KEY, async (err, decoded) => {
    if (err) return res.status(401).send({ message: "Unauthorized" });

    const user = await User.findById(decoded._id);
    if (!user) return res.status(404).send({ message: "User not found" });
    const games = await Game.find({
      title: { $regex: title, $options: "i" },
    }).limit(20);
    if (!games || games.length === 0) {
      return res.status(404).send({ message: "No games found" });
    }
    const profileGames = await ProfileGame.find();
    const filteredGames = games.filter((game) => {
      return (
        !profileGames.some((profileGame) => profileGame.id === game.id) &&
        !profileGames.some((profileGame) =>
          game.title.startsWith(profileGame.title)
        )
      );
    });
    res.json(filteredGames);
  });
});

app.post("/api/getCover", async (req, res) => {
  const { id } = req.body;
  try {
    const cover = await Cover.findOne({ id: id });
    res.json(cover);
  } catch (err) {
    res.status(404).send({ message: err.message });
  }
});

app.put("/api/addToFavorites", async (req, res) => {
  let token = verifyToken(req, res);

  jwt.verify(token, SECRET_KEY, async (err, decoded) => {
    if (err) return res.status(401).send({ message: "Unauthorized" });

    const user = await User.findById(decoded._id);
    if (!user) return res.status(404).send({ message: "User not found" });
    const gameExists = await ProfileGame.findOne({ id: req.body.id });
    if (gameExists) {
      if (gameExists.isDisliked) {
        gameExists.isDisliked = false;
        gameExists.isFavorite = true;
        await gameExists.save();
        await user.updateOne({
          $pull: { dislikedGames: gameExists._id },
          $push: { favoriteGames: gameExists._id },
        });
        await user.save();
        res.json(user);
      } else if (!gameExists.isFavorite) {
        gameExists.isFavorite = true;
        await gameExists.save();
        await user.updateOne({
          $push: { favoriteGames: gameExists._id },
        });
        await user.save();
        res.json(user);
      } else {
        res.status(409).send({ message: "Game already in favorites" });
      }
    } else {
      const newProfileGame = new ProfileGame({
        _id: req.body._id,
        id: req.body.id,
        title: req.body.title,
        isFavorite: true,
        cover: req.body.cover,
      });
      await newProfileGame.save();
      await user.updateOne({
        $push: { favoriteGames: newProfileGame._id },
      });
      await user.save();
      res.json(newProfileGame);
    }
  });
});
app.put("/api/addToDisliked", async (req, res) => {
  let token = verifyToken(req, res);

  jwt.verify(token, SECRET_KEY, async (err, decoded) => {
    if (err) return res.status(401).send({ message: "Unauthorized" });

    const user = await User.findById(decoded._id);
    if (!user) return res.status(404).send({ message: "User not found" });
    const gameExists = await ProfileGame.findOne({ id: req.body.id });
    if (gameExists) {
      if (gameExists.isFavorite) {
        gameExists.isFavorite = false;
        gameExists.isDisliked = true;
        await gameExists.save();
        await user.updateOne({
          $pull: { favoriteGames: gameExists._id },
          $push: { dislikedGames: gameExists._id },
        });
        await user.save();
        res.json(user);
      } else if (!gameExists.isDisliked) {
        gameExists.isDisliked = true;
        await gameExists.save();
        await user.updateOne({
          $push: { dislikedGames: gameExists._id },
        });
        await user.save();
        res.json(user);
      } else {
        res.status(409).send({ message: "Game already in disliked" });
      }
    } else {
      const newProfileGame = new ProfileGame({
        _id: req.body._id,
        id: req.body.id,
        title: req.body.title,
        isDisliked: true,
        cover: req.body.cover,
      });
      await newProfileGame.save();
      await user.updateOne({
        $push: { dislikedGames: newProfileGame._id },
      });
      await user.save();
      res.json(user);
    }
  });
});

app.put("/api/addGame", async (req, res) => {
  let token = verifyToken(req, res);

  jwt.verify(token, SECRET_KEY, async (err, decoded) => {
    if (err) return res.status(401).send({ message: "Unauthorized" });

    const user = await User.findById(decoded._id);
    if (!user) return res.status(404).send({ message: "User not found" });
    const game = await ProfileGame.findOne({ title: req.body.title });
    if (game) {
      res.status(409).send({ message: "Game already in Library" });
    } else {
      try {
        const newProfileGame = new ProfileGame({
          _id: req.body._id,
          id: req.body.id,
          title: req.body.title,
          state: req.body.state,
          platform: req.body.platform,
          cover: req.body.cover,
        });
        await newProfileGame.save();
        switch (newProfileGame.state) {
          case "Finished":
            newProfileGame.isCompleted = true;
            await user.updateOne({
              $push: { finishedGames: newProfileGame._id },
            });
            await newProfileGame.save();
            await user.save();
            break;
          case "Playing":
            newProfileGame.isPlaying = true;
            await user.updateOne({
              $push: { currentlyPlaying: newProfileGame._id },
            });
            await newProfileGame.save();
            await user.save();
            break;
          case "Plan to play":
            newProfileGame.isPlanToPlay = true;
            await user.updateOne({
              $push: { planOnPlaying: newProfileGame._id },
            });
            await newProfileGame.save();
            await user.save();
            res.json(user);
            break;
        }
      } catch (err) {
        res.status(404).send({ message: err.message });
      }
    }
  });
});

app.put("/api/removeGame", async (req, res) => {
  let token = verifyToken(req, res);
  const { id } = req.body;

  jwt.verify(token, SECRET_KEY, async (err, decoded) => {
    if (err) return res.status(401).send({ message: "Unauthorized" });

    const user = await User.findById(decoded._id);
    if (!user) return res.status(404).send({ message: "User not found" });
    const game = await ProfileGame.findOne({ id: id });
    if (!game) return res.status(404).send({ message: "Game not found" });
    const result = await ProfileGame.findByIdAndDelete(game._id);
    await user.updateOne({
      $pull: {
        currentlyPlaying: game._id,
        finishedGames: game._id,
        planOnPlaying: game._id,
        favoriteGames: game._id,
        dislikedGames: game._id,
      },
    });
    await user.save();
    res.json(result);
  });
});

app.put("/api/moveGame", async (req, res) => {
  let token = verifyToken(req, res);

  jwt.verify(token, SECRET_KEY, async (err, decoded) => {
    if (err) return res.status(401).send({ message: "Unauthorized" });

    const user = await User.findById(decoded._id);
    if (!user) return res.status(404).send({ message: "User not found" });
    const game = await ProfileGame.findOne({ id: req.body.id });
    if (!game) {
      try {
        const newProfileGame = new ProfileGame({
          _id: req.body._id,
          id: req.body.id,
          title: req.body.title,
          state: req.body.state,
          platform: req.body.platform,
          cover: req.body.cover,
        });
        await newProfileGame.save();
        switch (newProfileGame.state) {
          case "Finished":
            newProfileGame.isCompleted = true;
            await user.updateOne({
              $push: { finishedGames: newProfileGame._id },
            });
            await user.save();
            break;
          case "Playing":
            newProfileGame.isPlaying = true;
            await user.updateOne({
              $push: { currentlyPlaying: newProfileGame._id },
            });
            await user.save();
            break;
          case "Plan to play":
            newProfileGame.isPlanToPlay = true;
            await user.updateOne({
              $push: { planOnPlaying: newProfileGame._id },
            });
            await newProfileGame.save();
            await user.save();
            res.json(user);
            break;
        }
      } catch (err) {
        res.status(404).send({ message: err.message });
      }
    } else {
      switch (game.state) {
        case "Finished":
          await game.save();
          await user.updateOne({
            $pull: { currentlyPlaying: game._id, planOnPlaying: game._id },
            $push: { finishedGames: game._id },
          });
          await user.save();
          break;
        case "Playing":
          await user.updateOne({
            $pull: {
              planOnPlaying: game._id,
              finishedGames: game._id,
            },
            $push: { currentlyPlaying: game._id },
          });
          await user.save();
          break;
        case "Plan to play":
          await user.updateOne({
            $pull: {
              currentlyPlaying: game._id,
              finishedGames: game._id,
            },
            $push: { planOnPlaying: game._id },
          });
          await user.save();
          break;
      }
      await user.save();
      res.json(user);
    }
  });
});

app.get("/api/getProfileGames", async (req, res) => {
  let token = verifyToken(req, res);

  jwt.verify(token, SECRET_KEY, async (err, decoded) => {
    if (err) return res.status(401).send({ message: "Unauthorized" });

    const user = await User.findById(decoded._id);
    if (!user) return res.status(404).send({ message: "User not found" });
    const profileGames = await ProfileGame.find();
    res.json(profileGames);
  });
});

app.get("/api/getFavoriteGames", async (req, res) => {
  let token = verifyToken(req, res);

  jwt.verify(token, SECRET_KEY, async (err, decoded) => {
    if (err) return res.status(401).send({ message: "Unauthorized" });

    const user = await User.findById(decoded._id);
    if (!user) return res.status(404).send({ message: "User not found" });
    const favoriteGames = await User.find({}, { favoriteGames: 1, _id: 0 });
    if (!favoriteGames || favoriteGames.length === 0) {
      return res.status(404).send({ message: "No games found" });
    }
    const allFavoriteGames = favoriteGames.flatMap(
      (user) => user.favoriteGames
    );

    res.json(allFavoriteGames);
  });
});

app.get("/api/getCurrentlyPlayingGames", async (req, res) => {
  let token = verifyToken(req, res);

  jwt.verify(token, SECRET_KEY, async (err, decoded) => {
    if (err) return res.status(401).send({ message: "Unauthorized" });

    const user = await User.findById(decoded._id);
    if (!user) return res.status(404).send({ message: "User not found" });
    const currentlyPlayingGames = await User.find(
      {},
      { currentlyPlaying: 1, _id: 0 }
    );
    if (!currentlyPlayingGames || currentlyPlayingGames.length === 0) {
      return res.status(404).send({ message: "No games found" });
    }
    const allCurrentlyPlayingGames = currentlyPlayingGames.flatMap(
      (user) => user.currentlyPlaying
    );
    res.json(allCurrentlyPlayingGames);
  });
});

app.get("/api/getFinishedGames", async (req, res) => {
  let token = verifyToken(req, res);

  jwt.verify(token, SECRET_KEY, async (err, decoded) => {
    if (err) return res.status(401).send({ message: "Unauthorized" });

    const user = await User.findById(decoded._id);
    if (!user) return res.status(404).send({ message: "User not found" });
    const finishedGames = await User.find({}, { finishedGames: 1, _id: 0 });
    if (!finishedGames || finishedGames.length === 0) {
      return res.status(404).send({ message: "No games found" });
    }
    const allFinishedGames = finishedGames.flatMap(
      (user) => user.finishedGames
    );
    res.json(allFinishedGames);
  });
});

app.get("/api/getPlanToPlayGames", async (req, res) => {
  let token = verifyToken(req, res);

  jwt.verify(token, SECRET_KEY, async (err, decoded) => {
    if (err) return res.status(401).send({ message: "Unauthorized" });

    const user = await User.findById(decoded._id);
    if (!user) return res.status(404).send({ message: "User not found" });
    const planToPlay = await User.find({}, { planOnPlaying: 1, _id: 0 });
    if (!planToPlay || planToPlay.length === 0) {
      return res.status(404).send({ message: "No games found" });
    }
    const allPlanToPlay = planToPlay.flatMap((user) => user.planOnPlaying);
    res.json(allPlanToPlay);
  });
});

app.get("/api/getDislikedGames", async (req, res) => {
  let token = verifyToken(req, res);

  jwt.verify(token, SECRET_KEY, async (err, decoded) => {
    if (err) return res.status(401).send({ message: "Unauthorized" });

    const user = await User.findById(decoded._id);
    if (!user) return res.status(404).send({ message: "User not found" });
    const dislikedGames = await User.find({}, { dislikedGames: 1, _id: 0 });
    if (!dislikedGames || dislikedGames.length === 0) {
      return res.status(404).send({ message: "No games found" });
    }
    const allDislikedGames = dislikedGames.flatMap(
      (user) => user.dislikedGames
    );

    res.json(allDislikedGames);
  });
});
app.put("/api/updateGame", async (req, res) => {
  let token = verifyToken(req, res);

  jwt.verify(token, SECRET_KEY, async (err, decoded) => {
    if (err) return res.status(401).send({ message: "Unauthorized" });

    const user = await User.findById(decoded._id);
    if (!user) return res.status(404).send({ message: "User not found" });
    const game = await ProfileGame.find(req.body);
    if (!game) return res.status(404).send({ message: "Game not found" });
    const updateGame = await ProfileGame.findByIdAndUpdate(
      req.body._id,
      { $set: req.body },
      { new: true }
    );
    await updateGame.save();

    res.json(updateGame);
  });
});

app.post("/api/getGameById", async (req, res) => {
  const { id } = req.body;
  try {
    const game = await Game.findById(id);
    if (!game) return res.status(404).send({ message: Game.length });
    res.json(game);
  } catch (err) {
    res.status(404).send({ message: err.message });
  }
});

app.post("/api/getProfileGameById", async (req, res) => {
  const { id } = req.body;
  try {
    const game = await ProfileGame.findById(id);
    if (!game) return res.status(404).send({ message: "Game not found" });
    res.json(game);
  } catch (err) {
    res.status(404).send({ message: err.message });
  }
});
function verifyToken(req, res, next) {
  let token = "";
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
    console.log(token);
    return token;
  } else {
    console.log("Authorization header is missing or improperly formatted");
    return "";
  }
}
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

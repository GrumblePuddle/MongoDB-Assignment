import express from "express";
import mongoose from "mongoose";
import User from "./models/user.js"; // Adjust the path as necessary

const app = express();
const PORT = 3000;
const MONGO_URI = "mongodb://localhost:27017/mynewdatabase";
app.use(express.json());

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.get("/", (req, res) => {
  res.send("MongoDB connection test working!");
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    const saved = await user.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userInfo = req.body;
    const user = await User.findByIdAndUpdate(id, userInfo, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

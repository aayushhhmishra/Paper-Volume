require("dotenv").config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const multer = require("multer");

const User = require("./models/user");
const Track = require("./models/track");

const app = express();
const PORT = 3000;


// Multer Storage

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });


// Middleware

app.use(express.static(__dirname));
app.use(express.json());


// MongoDB Connection

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error);
    });


// Home Page

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});


// Register User

app.post("/api/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        const newUser = new User({
            name,
            email,
            password
        });

        await newUser.save();

        res.status(201).json({
            message: "Account created successfully"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Something went wrong"
        });
    }
});


// Login User

app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        res.status(200).json({
            message: "Login successful",
            user: {
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Something went wrong"
        });
    }
});


// Upload Song

app.post("/api/upload", upload.single("song"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No song uploaded"
            });
        }

        const { title, artist, genre, uploadedBy } = req.body;

        if (!title || !artist || !genre || !uploadedBy) {
            return res.status(400).json({
                message: "Please provide all song details"
            });
        }

        const newTrack = new Track({
            title,
            artist,
            genre,
            file: req.file.filename,
            uploadedBy
        });

        await newTrack.save();

        res.status(201).json({
            message: "Song uploaded successfully",
            track: newTrack
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Song upload failed"
        });
    }
});


// Get All Tracks

app.get("/api/tracks", async (req, res) => {
    try {
        const tracks = await Track.find()
            .sort({ createdAt: -1 });

        res.status(200).json(tracks);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Could not fetch tracks"
        });
    }
});


// Start Server

app.listen(PORT, () => {
    console.log("Server running at http://localhost:" + PORT);
});
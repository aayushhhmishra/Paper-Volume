require("dotenv").config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const multer = require("multer");
const { once } = require("events");

const User = require("./models/user");
const Track = require("./models/track");

const app = express();

// Multer Storage

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware

app.use(express.static(__dirname));
app.use(express.json());
app.use((req, res, next) => {
    console.log(`[request] ${req.method} ${req.path}`);
    res.on("finish", () => {
        console.log(`[response] ${req.method} ${req.path} ${res.statusCode}`);
    });
    next();
});

// MongoDB Connection

let databaseConnection;

async function connectDatabase() {
    if (mongoose.connection.readyState === 1) {
        console.log("[database] already connected");
        return;
    }

    if (!process.env.MONGODB_URI) {
        console.error("[database] MONGODB_URI is missing");
        throw new Error("MONGODB_URI is not configured");
    }

    if (!databaseConnection) {
        console.log("[database] connecting to MongoDB");
        databaseConnection = mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        }).catch((error) => {
            databaseConnection = undefined;
            console.error("[database] connection failed:", error.name, error.message);
            throw error;
        });
    }

    await databaseConnection;
    console.log("[database] connected successfully");
}

// Home Page

app.get("/", (req, res) => {
res.sendFile(path.join(__dirname, "index.html"));
});

// Register User

app.post("/api/register", async (req, res) => {
try {
const { name, email, password } = req.body;

    console.log("[register] started", { email, hasName: Boolean(name), hasPassword: Boolean(password) });

    await connectDatabase();

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

    console.log("[register] user created", { email });

    res.status(201).json({
        message: "Account created successfully"
    });

} catch (error) {
    console.error("[register] failed:", error.name, error.message);

    res.status(500).json({
        message: "Something went wrong"
    });
}

});

// Login User

app.post("/api/login", async (req, res) => {
try {
const { email, password } = req.body;

    console.log("[login] started", { email, hasPassword: Boolean(password) });

    await connectDatabase();

    console.log("[login] querying user", { email });

    const user = await User.findOne({ email });

    if (!user) {
        console.log("[login] user not found", { email });
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    const passwordMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!passwordMatch) {
        console.log("[login] password mismatch", { email });
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

    console.log("[login] successful", { email });

} catch (error) {
    console.error("[login] failed:", error.name, error.message);

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

    await connectDatabase();

    const audioBucket = new mongoose.mongo.GridFSBucket(
        mongoose.connection.db,
        { bucketName: "audio" }
    );

    const audioUpload = audioBucket.openUploadStream(req.file.originalname, {
        contentType: req.file.mimetype
    });

    audioUpload.end(req.file.buffer);
    await once(audioUpload, "finish");

    const newTrack = new Track({
        title,
        artist,
        genre,
        file: req.file.originalname,
        fileId: audioUpload.id,
        uploadedBy
    });

    await newTrack.save();

    res.status(201).json({
        message: "Song uploaded successfully",
        track: newTrack
    });

} catch (error) {
    console.error("[upload] failed:", error.name, error.message);

    res.status(500).json({
        message: "Song upload failed"
    });
}

});

// Stream Uploaded Audio

app.get("/api/audio/:fileId", async (req, res) => {
    try {
        await connectDatabase();

        const fileId = new mongoose.Types.ObjectId(req.params.fileId);
        const audioBucket = new mongoose.mongo.GridFSBucket(
            mongoose.connection.db,
            { bucketName: "audio" }
        );

        res.type("audio/mpeg");
        audioBucket.openDownloadStream(fileId).on("error", () => {
            if (!res.headersSent) {
                res.status(404).json({ message: "Audio file not found" });
            } else {
                res.destroy();
            }
        }).pipe(res);
    } catch (error) {
        console.error("[audio] failed:", error.name, error.message);
        res.status(404).json({ message: "Audio file not found" });
    }
});

// Get All Tracks

app.get("/api/tracks", async (req, res) => {
try {
    await connectDatabase();

const tracks = await Track.find()
.sort({ createdAt: -1 });

    res.status(200).json(tracks);

} catch (error) {
    console.error("[tracks] failed:", error.name, error.message);

    res.status(500).json({
        message: "Could not fetch tracks"
    });
}

});

// Start Server

module.exports = app;

if (require.main === module) {
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log("Server running at http://localhost:" + PORT);
    });
}
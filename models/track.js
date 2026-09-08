const mongoose = require("mongoose");

const trackSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    artist: {
        type: String,
        required: true
    },

    genre: {
        type: String,
        required: true
    },

    file: {
        type: String,
        required: true
    },

    uploadedBy: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Track", trackSchema);
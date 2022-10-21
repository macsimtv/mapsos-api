const mongoose = require('mongoose');

const Marker = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    icon: {
        type: String
    },
    description: {
        type: String,
        required: true,
    },
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Marker', Marker);
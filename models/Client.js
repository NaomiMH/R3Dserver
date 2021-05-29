const mongoose = require('mongoose');

const ClientSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    f_lastname: {
        type: String,
        required: true,
        trim: true
    },
    m_lastname: {
        type: String,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        required: true,
        trim: true
    },
    birthday: {
        type: Date,
        required: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

module.exports = mongoose.model('Client',ClientSchema);
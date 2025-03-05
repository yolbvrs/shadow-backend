const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    experience: { type: String },
    specialties: { type: String },
    idNumber: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'provider'], required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
 
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'provider'], required: true },
    experience: { type: String, default: null }, // Only for providers
    specialties: { type: String, default: null } // Only for providers
});

module.exports = mongoose.model('User', UserSchema);

const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobDetails: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Accepted", "Completed"], default: "Pending" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', JobSchema);
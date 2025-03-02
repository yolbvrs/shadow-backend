const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const User = require('../models/User');

// Send a Job Request (Customer -> Provider)
router.post('/request', async (req, res) => {
    try {
        const { customerId, providerId, jobDetails } = req.body;

        // Check if provider exists
        const provider = await User.findById(providerId);
        if (!provider || provider.role !== "provider") {
            return res.status(404).json({ msg: "Provider not found" });
        }

        // Create job request
        const job = new Job({
            customerId,
            providerId,
            jobDetails,
            status: "Pending"
        });
        await job.save();

        res.json({ msg: "Job request sent successfully!" });
    } catch (error) {
        console.error("Error sending job request:", error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});

// Get Provider's Job Requests
router.get('/provider/:providerId', async (req, res) => {
    try {
        const providerId = req.params.providerId;
        const jobs = await Job.find({ providerId }).populate('customerId', 'name email');

        res.json(jobs);
    } catch (error) {
        console.error("Error fetching job requests:", error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});

module.exports = router;
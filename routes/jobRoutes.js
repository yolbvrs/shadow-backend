const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const User = require('../models/User');

// ✅ Corrected: Save Job Request (Must be a POST request)
router.post('/request', async (req, res) => {
    try {
        console.log("Received Job Request:", req.body); // Debugging

        const { customerId, providerId, jobDetails } = req.body;
        if (!customerId || !providerId || !jobDetails) {
            console.log("Missing required fields:", req.body);
            return res.status(400).json({ msg: "Missing required fields" });
        }

        const provider = await User.findById(providerId);
        if (!provider || provider.role !== "provider") {
            console.log("Provider not found:", providerId);
            return res.status(404).json({ msg: "Provider not found" });
        }

        const job = new Job({
            customerId,
            providerId,
            jobDetails,
            status: "Pending"
        });
        await job.save();

        console.log("Job request saved successfully:", job);
        res.json({ msg: "Job request sent successfully!", job });
    } catch (error) {
        console.error("Error sending job request:", error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});

module.exports = router;
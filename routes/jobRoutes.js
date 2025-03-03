const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware'); // ✅ Import middleware

// ✅ Create Job Request (POST)
router.post('/request', async (req, res) => {
    try {
        console.log("📩 Received Job Request:", req.body);

        let { customerId, providerId, jobDetails } = req.body;

        // Validate required fields
        if (!customerId || !providerId || !jobDetails) {
            console.log("❌ Missing required fields:", req.body);
            return res.status(400).json({ msg: "Missing required fields" });
        }

        // Validate customer existence
        const customer = await User.findById(customerId);
        if (!customer) {
            console.log("❌ Customer not found:", customerId);
            return res.status(404).json({ msg: "Customer not found" });
        }

        // Validate provider existence and role
        const provider = await User.findById(providerId);
        if (!provider || provider.role !== "provider") {
            console.log("❌ Provider not found or not a valid provider:", providerId);
            return res.status(404).json({ msg: "Provider not found or not authorized" });
        }

        // Sanitize job details to prevent XSS attacks
        jobDetails = sanitizeHtml(jobDetails);

        // Create job request
        const job = new Job({
            customerId,
            providerId,
            jobDetails,
            status: "Pending"
        });

        await job.save();

        console.log("✅ Job request saved successfully:", job);
        res.json({ msg: "Job request sent successfully!", job });
    } catch (error) {
        console.error("🚨 Error sending job request:", error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});

// ✅ Accept or Reject Job Request
// ✅ Get all job requests for a specific customer
router.get('/customer/:customerId', async (req, res) => {
    try {
        const customerId = req.params.customerId;
        const jobs = await Job.find({ customerId }).populate('providerId', 'name email');

        if (!jobs.length) {
            return res.status(404).json({ msg: "No job requests found for this customer" });
        }

        res.json(jobs);
    } catch (error) {
        console.error("Error fetching customer job requests:", error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});

// ✅ Protect job request API
router.post('/request', authMiddleware, async (req, res) => {
    try {
        const { customerId, providerId, jobDetails } = req.body;

        if (!customerId || !providerId || !jobDetails) {
            return res.status(400).json({ msg: "Missing required fields" });
        }

        const job = new Job({ customerId, providerId, jobDetails, status: "Pending" });
        await job.save();

        res.json({ msg: "Job request sent successfully!", job });
    } catch (error) {
        console.error("Error sending job request:", error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});

module.exports = router;

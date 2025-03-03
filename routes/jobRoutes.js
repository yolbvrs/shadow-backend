const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const User = require('../models/User');
const sanitizeHtml = require('sanitize-html'); // Prevents XSS attacks

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

// ✅ Accept or Reject Job Request (PUT)
router.put('/update/:jobId', async (req, res) => {
    try {
        console.log("🔄 Updating Job Status:", req.params.jobId);

        const { status, userId } = req.body; // Expecting "Accepted" or "Rejected"

        if (!["Accepted", "Rejected"].includes(status)) {
            console.log("❌ Invalid status update:", status);
            return res.status(400).json({ msg: "Invalid status update" });
        }

        // Find job and verify it exists
        const job = await Job.findById(req.params.jobId);
        if (!job) {
            console.log("❌ Job not found:", req.params.jobId);
            return res.status(404).json({ msg: "Job not found" });
        }

        // Ensure only the provider can update job status
        if (job.providerId.toString() !== userId) {
            console.log("⛔ Unauthorized attempt to update job:", userId);
            return res.status(403).json({ msg: "Unauthorized to update this job" });
        }

        // Update job status
        job.status = status;
        await job.save();

        console.log(`✅ Job ${status.toLowerCase()} successfully!`, job);
        res.json({ msg: `Job ${status.toLowerCase()} successfully!`, job });
    } catch (error) {
        console.error("🚨 Error updating job status:", error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});

module.exports = router;

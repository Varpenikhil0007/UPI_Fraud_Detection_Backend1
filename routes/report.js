const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const auth = require('../middleware/auth');

// Get reports for authenticated user
router.get('/user', auth, async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user.id })
      .sort({ createdAt: -1 }); // Sort by newest first

    res.json(reports);
  } catch (error) {
    console.error('Error fetching user reports:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit a new report
router.post('/', auth, async (req, res) => {
  try {
    const { transactionId, fraudType, description, amount, upiId } = req.body;

    const newReport = new Report({
      userId: req.user.id,
      transactionId,
      fraudType,
      description,
      amount,
      upiId,
      status: 'pending'
    });

    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
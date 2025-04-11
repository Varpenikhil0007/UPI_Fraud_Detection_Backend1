import express from 'express';
import authMiddleware from '../middleware/auth.js';
import Report from '../models/Report.js';

const router = express.Router();

// Create new fraud report
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      transactionId,
      fraudType,
      description,
      amount,
      upiId,
      deviceInfo,
      location,
      suspiciousActivity,
      evidenceDescription,
      attachments
    } = req.body;

    // Validate required fields
    if (!transactionId || !fraudType || !description || !amount || !upiId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Create report with user association
    const report = new Report({
      userId: req.user.id,
      transactionId,
      fraudType,
      description,
      amount,
      upiId,
      deviceInfo,
      location,
      suspiciousActivity,
      evidenceDescription,
      attachments
    });

    await report.save();
    res.status(201).json({
      success: true,
      message: 'Report created successfully',
      data: report
    });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating report'
    });
  }
});

// Get all reports for user with pagination and filtering
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const fraudType = req.query.fraudType;

    const query = { userId: req.user.id };
    if (status) query.status = status;
    if (fraudType) query.fraudType = fraudType;

    const total = await Report.countDocuments(query);
    const reports = await Report.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: {
        reports,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reports'
    });
  }
});

// Get report by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching report'
    });
  }
});

export default router;
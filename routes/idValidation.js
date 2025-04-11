import express from 'express';
// import IdModel from '../models/IdModel.js';
import ReportModel from '../models/Report.js';


const router = express.Router();

router.post('/validate', async (req, res) => {
    try {
      const { id } = req.body;
      console.log("Received ID:", id); // Add this

      // Check database for existing fraud records FIRST
      const existingFraud = await ReportModel.findOne({ upiId: id });
      console.log('Received ID:', id);
      console.log('Fraud DB Lookup:', !!existingFraud);



      console.log("Fraud DB Lookup:", !!existingFraud); // Add this

      // Pattern detection (always apply)
      const hasSequential = hasSequentialPattern(id);
      const hasKeywords = containsFraudKeywords(id);
      console.log("Sequential:", hasSequential, "Keywords:", hasKeywords); // Add this

      // Format check
    //   const isValidFormat = /^[A-Z0-9]{12}$/.test(id);
    //   const formatMsg = isValidFormat ? [] : ['Invalid ID format'];

      const messages = [
        ...(existingFraud ? ['Found in fraud database'] : []),
        ...(hasSequential ? ['Sequential pattern detected'] : []),
        ...(hasKeywords ? ['Suspicious keywords found'] : []),
        // ...formatMsg
      ];

      res.json({
  isFraudulent: !!existingFraud || hasSequential || hasKeywords,
  messages: messages.length > 0 ? messages : ['No suspicious patterns found'],
  fraudReport: existingFraud
    ? {
        fraudType: existingFraud.fraudType,
        description: existingFraud.description,
        location: existingFraud.location,
        suspiciousActivity: existingFraud.suspiciousActivity,
        amount: existingFraud.amount,
        evidenceDescription: existingFraud.evidenceDescription
      }
    : null
});

    } catch (error) {
      console.error('Validation error:', error);
      res.status(500).json({
        isFraudulent: true,
        messages: ['Validation service unavailable'],
        isValidFormat: false
      });
    }
});

  
  

// Pattern detection functions
function hasSequentialPattern(id) {
  const lowerId = id.toLowerCase();
  for (let i = 0; i < lowerId.length - 2; i++) {
    const a = lowerId.charCodeAt(i);
    const b = lowerId.charCodeAt(i + 1);
    const c = lowerId.charCodeAt(i + 2);
    if (b === a + 1 && c === b + 1) return true;
  }
  return false;
}

function containsFraudKeywords(id) {
  const FRAUD_KEYWORDS = ['admin', 'support', 'help', 'verify', 'fraud', 'scam'];
  return FRAUD_KEYWORDS.some(keyword =>
    id.toLowerCase().includes(keyword.toLowerCase())
  );
}

export default router;

import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  transactionId: { type: String, required: true },
  fraudType: { type: String, required: true, enum: ['UPI_FRAUD', 'PHISHING', 'IMPERSONATION', 'OTHER'] },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  upiId: { type: String, required: true },
  deviceInfo: { type: String, required: true },
  location: { type: String, required: true },
  suspiciousActivity: { type: String, required: true },
  evidenceDescription: { type: String, required: true },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Under Investigation', 'Resolved', 'Rejected'] },
  attachments: [{ type: String }]
}, { timestamps: true });

// Index for faster queries
ReportSchema.index({ userId: 1, createdAt: -1 });
ReportSchema.index({ status: 1 });
ReportSchema.index({ upiId: 1 });


export default mongoose.model('Report', ReportSchema);
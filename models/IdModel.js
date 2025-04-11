import mongoose from 'mongoose';


const IdSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
        // No regex so we can allow normal UPI IDs like 'abc123@upi'
      },      
  createdAt: {
    type: Date,
    default: Date.now
  },
  fraudType: {
    type: String,
    required: true
  },
  reports: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report'
  }]
});

export default mongoose.model('Id', IdSchema);
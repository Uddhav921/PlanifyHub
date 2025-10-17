import mongoose from 'mongoose';

const withdrawalRequestSchema = new mongoose.Schema({
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'Host', required: true },
  amount: { type: Number, required: true },
  bankAccount: {
    accountNumber: String,
    ifscCode: String,
    accountHolderName: String,
    bankName: String
  },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  requestDate: { type: Date, default: Date.now },
  processedDate: Date,
  adminNotes: String
});

export default mongoose.model('WithdrawalRequest', withdrawalRequestSchema);
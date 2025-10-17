import mongoose from 'mongoose';

const hostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  businessName: { type: String, required: true },
  businessType: { type: String, required: true },
  businessAddress: String,
  city: String,
  state: String,
  pincode: String,
  verificationStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  otpVerified: { type: Boolean, default: false },
  otpCode: String,
  otpExpires: Date,
  documents: [{
    type: String, // 'businessLicense', 'panCard', etc.
    url: String
  }],
  totalRevenue: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Host', hostSchema);
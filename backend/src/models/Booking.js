import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  numberOfTickets: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  bookingDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
  qrCode: String
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;

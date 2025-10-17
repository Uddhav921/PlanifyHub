import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  eventType: { type: String, required: true }, // concert, workshop, sports, etc.
  date: { type: Date, required: true },
  time: String,
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: String,
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'Host', required: true },
  price: { type: Number, required: true },
  capacity: { type: Number, required: true },
  ticketsSold: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  images: [String],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Event', eventSchema);
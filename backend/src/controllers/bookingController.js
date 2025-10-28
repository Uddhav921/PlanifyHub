// backend/src/controllers/bookingController.js
import { razorpay, verifyPayment } from "../utils/razorpay.js"
import Booking from '../models/Booking.js';
import Event from '../models/Event.js';


// Create a new booking with Razorpay order
export const createBooking = async (req, res) => {
  try {
    const { eventId, numberOfTickets } = req.body;
    const userId = req.user._id;

    // Input validation
    if (!eventId || !numberOfTickets || numberOfTickets < 1) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid input',
        code: 'INVALID_INPUT'
      });
    }

    // Check event and ticket availability
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ 
        success: false,
        message: 'Event not found',
        code: 'EVENT_NOT_FOUND'
      });
    }
    
    if (event.availableTickets < numberOfTickets) {
      return res.status(400).json({ 
        success: false,
        message: 'Not enough tickets available',
        code: 'INSUFFICIENT_TICKETS'
      });
    }

    // Calculate amount in paise (Razorpay's smallest currency unit)
    const amount = event.price * numberOfTickets * 100;

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount.toString(),
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      payment_capture: 1,
      notes: {
        eventId: event._id.toString(),
        userId: userId.toString(),
        tickets: numberOfTickets
      }
    });

    // Create booking in database (initially pending)
    const booking = new Booking({
      user: userId,
      event: eventId,
      numberOfTickets,
      totalAmount: amount / 100, // Store in rupees
      status: 'pending',
      paymentStatus: 'pending',
      paymentDetails: {
        orderId: order.id,
        amount: amount,
        currency: 'INR',
        status: 'created'
      }
    });

    // Generate QR code for the booking
    const qrData = JSON.stringify({
      bookingId: booking._id,
      eventId: event._id,
      userId: userId,
      timestamp: new Date().toISOString()
    });
    booking.qrCode = await QRCode.toDataURL(qrData);

    await booking.save();

    // Return the booking and Razorpay order details
    res.status(201).json({
      success: true,
      data: {
        booking,
        order: {
          id: order.id,
          amount: order.amount,
          currency: order.currency,
          key: process.env.RAZORPAY_KEY_ID
        }
      }
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      code: 'SERVER_ERROR',
      error: error.message 
    });
  }
};

// Verify payment and update booking
export const verifyBookingPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required parameters',
        code: 'MISSING_PARAMETERS'
      });
    }

    // Verify payment signature
    const isSignatureValid = verifyPayment(orderId, paymentId, signature);
    if (!isSignatureValid) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid payment signature',
        code: 'INVALID_SIGNATURE'
      });
    }

    // Find and update booking
    const booking = await Booking.findOne({ 'paymentDetails.orderId': orderId });
    if (!booking) {
      return res.status(404).json({ 
        success: false,
        message: 'Booking not found',
        code: 'BOOKING_NOT_FOUND'
      });
    }

    // Check if already processed
    if (booking.paymentStatus === 'completed') {
      return res.json({ 
        success: true,
        message: 'Payment already processed',
        data: { booking }
      });
    }

    // Update booking status
    booking.paymentStatus = 'completed';
    booking.status = 'confirmed';
    booking.paymentDetails.paymentId = paymentId;
    booking.paymentDetails.signature = signature;
    booking.paymentDetails.status = 'captured';
    booking.paymentDate = new Date();
    
    await booking.save();

    // Update event's available tickets
    await Event.findByIdAndUpdate(
      booking.event,
      { $inc: { availableTickets: -booking.numberOfTickets } }
    );

    res.json({ 
      success: true,
      message: 'Payment verified and booking confirmed',
      data: { booking }
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      code: 'SERVER_ERROR',
      error: error.message 
    });
  }
};

// Get booking by ID
export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate('event', 'title date venue');

    if (!booking) {
      return res.status(404).json({ 
        success: false,
        message: 'Booking not found',
        code: 'BOOKING_NOT_FOUND'
      });
    }

    // Check if user is authorized to view this booking
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to view this booking',
        code: 'UNAUTHORIZED_ACCESS'
      });
    }

    res.json({ 
      success: true,
      data: booking 
    });
  } catch (error) {
    console.error('Error getting booking:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      code: 'SERVER_ERROR'
    });
  }
};

// Get all bookings for the logged-in user
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('event', 'title date venue')
      .sort('-createdAt');

    res.json({ 
      success: true,
      data: bookings 
    });
  } catch (error) {
    console.error('Error getting user bookings:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      code: 'SERVER_ERROR'
    });
  }
};

// Get all bookings (Admin only)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('event', 'title date')
      .sort('-createdAt');

    res.json({ 
      success: true,
      data: bookings 
    });
  } catch (error) {
    console.error('Error getting all bookings:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      code: 'SERVER_ERROR'
    });
  }
};
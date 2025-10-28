// backend/src/routes/bookingRoutes.js
import express from 'express';
import {
  createBooking,
  verifyBookingPayment,
  getBooking,
  getUserBookings,
  getAllBookings
} from "../controllers/bookingController.js"
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply authentication to all booking routes
router.use(authenticate);

// User routes
router.post('/', createBooking);
router.get('/my-bookings', getUserBookings);
router.get('/:id', getBooking);
router.post('/verify-payment', verifyBookingPayment);

// Admin routes
router.get('/', authorize('admin'), getAllBookings);

export default router;
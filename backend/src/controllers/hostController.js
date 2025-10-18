import Host from '../models/Host.js';
import User from '../models/User.js';

// Register as host (create host profile)
export const registerHost = async (req, res) => {
  try {
    const { businessName, businessType, businessAddress, city, state, pincode } = req.body;

    // Check if user already has a host profile
    const existingHost = await Host.findOne({ userId: req.user.id });
    if (existingHost) {
      return res.status(400).json({ message: 'You already have a host profile' });
    }

    // Create host profile
    const host = new Host({
      userId: req.user.id,
      businessName,
      businessType,
      businessAddress,
      city,
      state,
      pincode,
      verificationStatus: 'pending'
    });

    await host.save();

    res.status(201).json({
      message: 'Host profile created successfully',
      host
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get host profile
export const getHostProfile = async (req, res) => {
  try {
    const host = await Host.findOne({ userId: req.user.id })
      .populate('userId', 'name email');

    if (!host) {
      return res.status(404).json({ message: 'Host profile not found' });
    }

    res.json(host);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get host dashboard stats
export const getHostDashboard = async (req, res) => {
  try {
    const host = await Host.findOne({ userId: req.user.id });
    
    if (!host) {
      return res.status(404).json({ message: 'Host profile not found' });
    }

    // Import Event model
    const Event = (await import('../models/Event.js')).default;
    const Booking = (await import('../models/Booking.js')).default;

    // Get host's events
    const events = await Event.find({ host: host._id });
    
    // Get total bookings for host's events
    const bookings = await Booking.find({ 
      event: { $in: events.map(e => e._id) } 
    });

    // Calculate stats
    const totalEvents = events.length;
    const totalBookings = bookings.length;
    const totalRevenue = host.totalRevenue || 0;
    const activeEvents = events.filter(e => e.status === 'approved').length;
    const pendingEvents = events.filter(e => e.status === 'pending').length;

    res.json({
      host,
      stats: {
        totalEvents,
        activeEvents,
        pendingEvents,
        totalBookings,
        totalRevenue
      },
      events
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update host profile
export const updateHostProfile = async (req, res) => {
  try {
    const host = await Host.findOne({ userId: req.user.id });
    
    if (!host) {
      return res.status(404).json({ message: 'Host profile not found' });
    }

    const updatedHost = await Host.findByIdAndUpdate(
      host._id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedHost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get host's events
export const getHostEvents = async (req, res) => {
  try {
    const host = await Host.findOne({ userId: req.user.id });
    
    if (!host) {
      return res.status(404).json({ message: 'Host profile not found' });
    }

    const Event = (await import('../models/Event.js')).default;
    const events = await Event.find({ host: host._id })
      .sort({ createdAt: -1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
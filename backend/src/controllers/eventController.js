import Event from '../models/Event.js';
import Host from '../models/Host.js';

// Get all events (public - with filters)
export const getAllEvents = async (req, res) => {
  try {
    const { 
      eventType, 
      city, 
      minPrice, 
      maxPrice, 
      dateFrom, 
      dateTo,
      status = 'approved' // Only show approved events to public
    } = req.query;

    const filter = { status };

    // Apply filters
    if (eventType) filter.eventType = eventType;
    if (city) filter['location.city'] = city;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    }

    const events = await Event.find(filter)
      .populate('host', 'businessName')
      .sort({ date: 1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single event by ID
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('host', 'businessName businessType city');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new event (host only)
export const createEvent = async (req, res) => {
  try {
    // Check if user is a host
    const host = await Host.findOne({ userId: req.user.id });
    
    if (!host) {
      return res.status(403).json({ message: 'Only hosts can create events' });
    }

    const eventData = {
      ...req.body,
      host: host._id,
      status: 'pending' // Requires admin approval
    };

    const newEvent = new Event(eventData);
    await newEvent.save();

    const event = await Event.findById(newEvent._id)
      .populate('host', 'businessName');

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update event (host only - requires re-approval)
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is the host
    const host = await Host.findOne({ userId: req.user.id });
    if (!host || event.host.toString() !== host._id.toString()) {
      return res.status(403).json({ message: 'You can only update your own events' });
    }

    // Update event and set status to pending for re-approval
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { ...req.body, status: 'pending' },
      { new: true, runValidators: true }
    ).populate('host', 'businessName');

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete event (host only)
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const host = await Host.findOne({ userId: req.user.id });
    if (!host || event.host.toString() !== host._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own events' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get events by host (host's own events)
export const getHostEvents = async (req, res) => {
  try {
    const host = await Host.findOne({ userId: req.user.id });
    
    if (!host) {
      return res.status(403).json({ message: 'Only hosts can access this' });
    }

    const events = await Event.find({ host: host._id })
      .populate('host', 'businessName')
      .sort({ createdAt: -1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
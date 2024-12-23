// routes/events.js
const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Create an Event
router.post('/', async (req, res) => {
  try {
    const { name, description, location, date } = req.body;
    if (!name || !location || !date) {
      return res.status(400).json({ message: 'Required fields missing' });
    }
    const event = new Event({ name, description, location, date });
    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get All Events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().populate('attendees');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an Event
router.put('/:id', async (req, res) => {
  try {
    const { name, description, location, date } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    event.name = name || event.name;
    event.description = description || event.description;
    event.location = location || event.location;
    event.date = date || event.date;

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an Event
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

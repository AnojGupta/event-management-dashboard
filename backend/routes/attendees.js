// routes/attendees.js
const express = require('express');
const router = express.Router();
const Attendee = require('../models/Attendee');
const Event = require('../models/Event');

// Add an Attendee
router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }
    const existingAttendee = await Attendee.findOne({ email });
    if (existingAttendee) {
      return res.status(400).json({ message: 'Attendee with this email already exists' });
    }
    const attendee = new Attendee({ name, email });
    const savedAttendee = await attendee.save();
    res.status(201).json(savedAttendee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get All Attendees
router.get('/', async (req, res) => {
  try {
    const attendees = await Attendee.find().populate('tasks');
    res.json(attendees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an Attendee
router.delete('/:id', async (req, res) => {
  try {
    const attendee = await Attendee.findByIdAndDelete(req.params.id);
    if (!attendee) return res.status(404).json({ message: 'Attendee not found' });
    res.json({ message: 'Attendee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Assign Attendee to Event
router.post('/:attendeeId/assign/:eventId', async (req, res) => {
  try {
    const { attendeeId, eventId } = req.params;
    const attendee = await Attendee.findById(attendeeId);
    const event = await Event.findById(eventId);
    if (!attendee || !event) {
      return res.status(404).json({ message: 'Attendee or Event not found' });
    }
    if (!event.attendees.includes(attendeeId)) {
      event.attendees.push(attendeeId);
      await event.save();
    }
    res.json({ message: 'Attendee assigned to event successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

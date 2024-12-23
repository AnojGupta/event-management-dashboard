// routes/tasks.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Event = require('../models/Event');
const Attendee = require('../models/Attendee');

// Create a Task
router.post('/', async (req, res) => {
  try {
    const { name, deadline, assignedTo, eventId } = req.body;
    if (!name || !deadline || !assignedTo || !eventId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Verify Event and Attendee existence
    const event = await Event.findById(eventId);
    const attendee = await Attendee.findById(assignedTo);
    if (!event || !attendee) {
      return res.status(404).json({ message: 'Event or Attendee not found' });
    }

    const task = new Task({
      name,
      deadline,
      assignedTo,
      event: eventId,
    });

    const savedTask = await task.save();

    // Assign task to attendee
    attendee.tasks.push(savedTask._id);
    await attendee.save();

    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Tasks for an Event
router.get('/event/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const tasks = await Task.find({ event: eventId }).populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Task Status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.status = status;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

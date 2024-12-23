// models/Event.js
const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attendee' }],
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);

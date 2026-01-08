const mongoose = require('mongoose');
const { Schema } = mongoose;

const EventSchema = new Schema({
  title: { type: String, required: true },
  date: { type: Date },
  location: { type: String },
  description: { type: String },
  posterPath: { type: String, default: null },
  attendees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  club: { type: Schema.Types.ObjectId, ref: 'Club' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', EventSchema);
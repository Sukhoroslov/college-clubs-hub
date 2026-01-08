const mongoose = require('mongoose');
const { Schema } = mongoose;

const ClubSchema = new Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, trim: true },
  interests: [{ type: String }],
  description: { type: String },
  logoPath: { type: String, default: null },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  president: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Club', ClubSchema);
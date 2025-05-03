const mongoose = require('mongoose');

const ngoProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // NGO user
  organizationName: { type: String, required: true },
  description: String,
  address: String,
  phone: String,
  isVerified: { type: Boolean, default: false }, // Admin will update this
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('NgoProfile', ngoProfileSchema);

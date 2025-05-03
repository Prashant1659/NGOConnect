const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String }, // Optional - for later expansion
  donatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donation', donationSchema);

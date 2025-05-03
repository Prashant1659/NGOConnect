const mongoose = require('mongoose');

const usageReportSchema = new mongoose.Schema({
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  reportText: { type: String, required: true },
  reportImage: { type: String }, // Image URL if any proof document
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UsageReport', usageReportSchema);

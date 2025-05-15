// models/Campaign.js
const mongoose = require('mongoose');

// Check if the model already exists before defining it
const Campaign = mongoose.models.Campaign || 
  mongoose.model('Campaign', new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    ngoName: { type: String, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String },
    goalAmount: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    donorsCount: { type: Number, default: 0 },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    updates: [{
      title: String,
      content: String,
      date: { type: Date, default: Date.now }
    }]
  }));

module.exports = Campaign;
const mongoose = require('mongoose');

// const campaignSchema = new mongoose.Schema({
//   ngo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Only NGO creates
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   goalAmount: { type: Number, required: true },
//   currentAmount: { type: Number, default: 0 }, // Updates as donations come
//   usageDescription: String, // For donors to see how funds will be used
//   status: { type: String, enum: ['active', 'completed'], default: 'active' },
//   createdAt: { type: Date, default: Date.now }
// });

// const campaignSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   currentAmount: { type: Number, required: true, default:0 },
//   goalAmount: { type: Number, required: true },
// });


const updateSchema = new mongoose.Schema({
  title: String,
  content: String,
  image: String,
  date: { type: Date, default: Date.now }
});

const campaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  coverImage: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  amountRaised: { type: Number, default: 0 },
  donors: { type: Number, default: 0 },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  updates: [updateSchema]
});

module.exports = mongoose.model('Campaign', campaignSchema);

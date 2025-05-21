const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  ngo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Only NGO creates
  title: { type: String, required: true },
  description: { type: String, required: true },
  goalAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 }, // Updates as donations come
  usageDescription: String, // For donors to see how funds will be used
  ngoName:{type:String,required:true},
  filePath:{type:String,required:true},
  endDate:{type:Date,required:true},
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

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


module.exports = mongoose.model('Campaign', campaignSchema);

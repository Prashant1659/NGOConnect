const mongoose = require('mongoose');

const ngoProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // NGO user
  organizationName: { type: String, required: true },
  organizationType:{type:String,required:true},
  registrationNumber:{type:String,required:true},
  certificate:{type:String,required:true},
  isVerified: { type: Boolean, default: false }, // Admin will update this
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('NgoProfile', ngoProfileSchema);

// server.js or routes/campaigns.js
const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign'); // Assuming you have a Campaign model

// Get single campaign by ID
router.get('/campaign/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    
    if (!campaign) {
      return res.status(404).send('Campaign not found');
    }

    // Calculate days left (example)
    const daysLeft = Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24));
    
    // Add calculated fields to the campaign object
    const campaignData = {
      ...campaign._doc,
      daysLeft: daysLeft > 0 ? daysLeft : 0,
      progressPercentage: Math.min(Math.round((campaign.currentAmount / campaign.goalAmount) * 100), 100)
    };

    res.render('campaign', { campaign: campaignData });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
const Campaign = require('../models/campaign.models');
const Donation = require('../models/donation.models');
const User = require('../models/user.models');
// Dashboard
exports.dashboard = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.session.userId }).populate('campaign');
    const totalDonated = donations.reduce((sum, donation) => sum + donation.amount, 0);

    res.render('donor/dashboard', { donations, totalDonated });
  } catch (err) {
    console.error(err);
    res.redirect('/donor/dashboard');
  }
};

// List all campaigns
exports.listCampaigns = async (req, res) => {
  const campaigns = await Campaign.find({ status: 'active' }).populate('ngo');
  res.render('donor/campaigns', { campaigns });
};

// Get donation page
exports.getDonatePage = async (req, res) => {
    const campaignId = req.params.id;
    res.render('donor/donate', { campaignId });
  };
  
  // Make donation
  exports.postDonate = async (req, res) => {
    let { amount, customAmount } = req.body;
    if(!amount) amount = customAmount;
    const campaignId = req.params.id;
    try {
      const donation = new Donation({
        donor: req.session.userId,
        campaign: campaignId,
        amount
      });
      await donation.save();
  
      const campaign = await Campaign.findById(campaignId);
      campaign.currentAmount += parseFloat(amount);
      await campaign.save();
  
      res.redirect('/donor/campaigns');
    } catch (err) {
      console.error(err);
      res.redirect('/donor/campaigns');
    }
  };

  // View Usage Report
exports.viewUsageReport = async (req, res) => {
  const campaignId = req.params.id;
  try {
    const campaign = await Campaign.findById(campaignId).populate('ngo');
    res.render('donor/usage-report', { campaign });
  } catch (err) {
    console.error(err);
    res.redirect('/donor/campaigns');
  }
};
exports.profile = async (req, res) => {
  const userId = req.session.userId;
  try {
    const user = await User.findById(userId);
    res.render('donor/profile',{user});
  } catch (err) {
    console.error(err);
    res.redirect('/donor/profile');
  }
};

exports.viewUsageReport = async (req, res) => {
  try {
    const campaignId = req.params.campaignId; // Assuming you pass the campaignId in the URL
    const campaign = await Campaign.findById(campaignId); // Fetch campaign by ID from DB

   

    // Render the view and pass the campaign data
    res.render('donor/usage-report', { campaign });

  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching campaign data");
  }
};


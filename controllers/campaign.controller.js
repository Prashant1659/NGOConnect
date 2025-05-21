const Campaign = require('../models/Campaign');
const CampaignModels = require('../models/campaign.models');
const Donation = require('../models/donation.models');

exports.postDonate = async (req, res) => {
    // console.log(req.body);
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

  exports.getDonatePage = async (req, res) => {
    const campaignId = req.params.id;
    res.render('donor/donate', { campaignId });
  };
  
  // Make donation
  exports.postDonate = async (req, res) => {
    console.log(req.body);
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
  
      res.redirect('/');
    } catch (err) {
      console.error(err);
      res.redirect('/donor/campaigns');
    }
  };

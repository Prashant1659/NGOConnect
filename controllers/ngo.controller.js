const Campaign = require('../models/campaign.models');
const Donation = require('../models/donation.models');
const NgoProfile = require('../models/ngoProfile.models');
const bcrypt = require('bcrypt');
// Dashboard

// Dashboard
exports.dashboard = async (req, res) => {
  try {
    const ngoProfile = await NgoProfile.findOne({ user: req.session.userId });
    const campaigns = await Campaign.find({ ngo: ngoProfile._id });
    // const totalFundsRaised = await Donation.aggregate([
    //   { $match: { ngo: ngoProfile._id } },
    //   { $group: { _id: null, total: { $sum: "$amount" } } }
    // ]);

    res.render('ngo/dashboard', { 
      ngoProfile, 
      campaigns, 
      // totalFundsRaised: totalFundsRaised[0]?.total || 0 
      totalFundsRaised:0
    });
  } catch (err) {
    console.error(err);
    res.redirect('/ngo/dashboard');
  }
};


// Get Create Campaign Page
exports.getCreateCampaign = (req, res) => {
  res.render('ngo/createCampaign');
};

// Post Campaign Creation
exports.postCreateCampaign = async (req, res) => {
  // console.log(req);
  const { title, description, goalAmount, usageDescription } = req.body;
  try {
    const ngo = await NgoProfile.find({user:req.session.userId});
    const campaign = new Campaign({
      ngo: req.session.userId,
      title,
      ngoName:ngo[0].organizationName,
      description,
      goalAmount,
      usageDescription
    });
    await campaign.save();
    res.redirect('/ngo/dashboard');
  } catch (err) {
    console.error(err);
    res.redirect('/ngo/create-campaign');
  }
};

exports.getRegister = (req, res) => {
  res.render('auth/ngo-registration', { errorMessage: "" });
}

exports.postRegister = async (req, res) => {
  const { password } = req.body || {};

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

        const { organizationName, registrationNumber, registrationDate, address, phone, website, document } = req.body;
  
        const ngoProfile = new NgoProfile({
          // user: user._id,  // Link the User document with the NGO profile
          organizationName,
          registrationNumber,
          registrationDate,
          address,
          email,
          phone,
          website,
          password:hashedPassword,
          document,  // Save the document path (e.g., certificate or registration proof)
        });
  
        await ngoProfile.save();
      
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.redirect('/login');
  }
};

exports.Campaigns = async (req,res) => {
  try {
    const campaign = await Campaign.find().populate('ngo');

    if(!campaign) return res.render('error',{message:"Not able to find any campaign"});
    return res.render('causes',campaign);
  } catch (error) {
    return res.render('error',{message:error});
  }
}
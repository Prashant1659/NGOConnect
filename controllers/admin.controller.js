const NgoProfile = require('../models/ngoProfile.models');
const User = require('../models/user.models');
const Campaign = require('../models/campaign.models');


// Dashboard
exports.dashboard = async (req, res) => {
    try {
      const verifiedNgos = await NgoProfile.countDocuments({ isVerified: true });
      const activeDonors = await User.countDocuments({ role: 'donor' });
      const activeCampaigns = await Campaign.countDocuments({ status: 'active' });
      res.render('admin/dashboard', { verifiedNgos, activeDonors, activeCampaigns });
    } catch (err) {
      console.error(err);
      res.redirect('/admin/dashboard');
    }
  };
  

// Get NGOs needing verification
exports.getVerifyNgos = async (req, res) => {
  const ngos = await NgoProfile.find({ isVerified: false }).populate('user');
  res.render('admin/verifyNgos', { ngos });
};

// Verify NGO
exports.verifyNgo = async (req, res) => {
    try {
        const ngos = await NgoProfile.find({ isVerified: false });
        res.render('admin/verifyNgos', { ngos });
      } catch (err) {
        console.error(err);
        res.redirect('/admin/dashboard');
      }
};

// Manage users
exports.manageUsers = async (req, res) => {
    const users = await User.find({ role: { $in: ['ngo', 'donor'] } });
    res.render('admin/manageUsers', { users });
  };
  
  // Remove user
  exports.removeUser = async (req, res) => {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.redirect('/admin/manage-users');
  };

  // Approve NGO Verification
exports.approveNgo = async (req, res) => {
    try {
      const ngo = await NgoProfile.findById(req.params.ngoId);
      if (ngo) {
        ngo.isVerified = true;
        await ngo.save();
        res.redirect('/admin/verify-ngos');
      } else {
        res.status(404).send('NGO not found');
      }
    } catch (err) {
      console.error(err);
      res.redirect('/admin/verify-ngos');
    }
  };
  
  // Reject NGO Verification
  exports.rejectNgo = async (req, res) => {
    try {
      const ngo = await NgoProfile.findById(req.params.ngoId);
      if (ngo) {
        await ngo.remove();
        res.redirect('/admin/verify-ngos');
      } else {
        res.status(404).send('NGO not found');
      }
    } catch (err) {
      console.error(err);
      res.redirect('/admin/verify-ngos');
    }
  };

// Get Create Campaign Page
exports.getCreateCampaign = (req, res) => {
    res.render('admin/create-campaign');
  };
  
  // Post Campaign Creation
  exports.postCreateCampaign = async (req, res) => {
    console.log(req.body);
    const { title, description, goalAmount, usageDescription } = req.body;
    try {
      const campaign = new Campaign({
        ngo: req.session.userId,
        title,
        description,
        goalAmount,
        usageDescription
      });
      await campaign.save();
      res.redirect('/admin/dashboard');
    } catch (err) {
      console.error(err);
      res.redirect('/admin/create-campaign');
    }
  };

exports.getProfileUpdate = (req, res) => {
    res.render('admin/manageUserProfile');
  };

  exports.postProfileUpdate = async (req, res) => {
    try {
      res.redirect('/admin/dashboard');
    } catch (err) {
      console.error(err);
      res.redirect('/admin/create-campaign');
    }
  };
// routes/ngoRoutes.js
const express = require('express');
const router = express.Router();
const ngoController = require('../controllers/ngo.controller');
const { isAuthenticated, isRole, verifiedNgo } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware.js');
// NGO Dashboard
router.get('/dashboard', isAuthenticated, isRole('ngo'), verifiedNgo , ngoController.dashboard);
// router.get('/profile', isAuthenticated, isRole('ngo'), ngoController.profile);

// Add after dashboard route
router.get('/create-campaign', isAuthenticated, isRole('ngo'), ngoController.getCreateCampaign);
router.post('/create-campaign', isAuthenticated, isRole('ngo'), upload.singleFileUpload,ngoController.postCreateCampaign);

router.get('/campaigns',ngoController.Campaigns );

router.get('/register',ngoController.getRegister);
router.post('/register',ngoController.postRegister);

// router.get('/profile')
module.exports = router;

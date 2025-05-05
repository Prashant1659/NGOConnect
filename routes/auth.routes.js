// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { multiFileUpload } = require('../middlewares/upload.middleware.js');
const { verifiedNgo } = require('../middlewares/auth.middleware.js');

// Home route
router.get('/', authController.home);

// Register routes
router.get('/register', authController.getRegister);
router.post('/register', multiFileUpload, authController.postRegister);

// Login routes
router.get('/login', authController.getLogin);
router.post('/login', multiFileUpload, authController.postLogin);

// Logout
router.get('/logout', authController.logout);

// Static pages
router.get('/about', authController.getAbout);
router.get('/contact', authController.getContact);
router.get('/recommended', authController.getRecommended);
router.get('/ngos', authController.getNgos);

// Causes and Campaigns
router.get('/campaigns/:id', authController.getCampaignDetails);
router.get('/causes', authController.getCauses);
router.get('/causes/:id', authController.getCauseById);
// router.get('/campaigns/:id', authController.getCampaignDetails);
router.get('/causes/:id', authController.getCauseById); 
// router.get('/campaigns/:id', authController.getCampaignDetails);

module.exports = router;

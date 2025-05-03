// routes/donorRoutes.js
const express = require('express');
const router = express.Router();
const donorController = require('../controllers/donor.controller');
const { isAuthenticated, isRole } = require('../middlewares/auth.middleware');

// Donor Dashboard
router.get('/dashboard', isAuthenticated, isRole('donor'), donorController.dashboard);

// Add after dashboard route
router.get('/campaigns', isAuthenticated, isRole('donor'), donorController.listCampaigns);

router.get('/donate/:id', isAuthenticated, isRole('donor'), donorController.getDonatePage);
router.post('/donate/:id', isAuthenticated, isRole('donor'), donorController.postDonate);
router.get('/profile', isAuthenticated, isRole('donor'), donorController.profile);
router.get('/usage-report', isAuthenticated, isRole('donor'), donorController.viewUsageReport);


module.exports = router;

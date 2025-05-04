// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { isAuthenticated, isRole } = require('../middlewares/auth.middleware');
const { singleFileUpload } = require('../middlewares/upload.middleware');

// Admin Dashboard
router.get('/dashboard', isAuthenticated, isRole('admin'), adminController.dashboard);

// Add after dashboard route
router.get('/verify-ngos', isAuthenticated, isRole('admin'), adminController.getVerifyNgos);
router.post('/verify-ngos/:id', isAuthenticated, isRole('admin'), adminController.verifyNgo);
// Admin: Approve NGO Verification
router.post('/approve-ngo/:ngoId', isAuthenticated, isRole('admin'), adminController.approveNgo);

// Admin: Reject NGO Verification
router.post('/reject-ngo/:ngoId', isAuthenticated, isRole('admin'), adminController.rejectNgo);

router.get('/manage-users', isAuthenticated, isRole('admin'), adminController.manageUsers);
router.post('/remove-user/:id', isAuthenticated, isRole('admin'), adminController.removeUser);
router.get('/create-campaign', isAuthenticated, isRole('admin'), adminController.getCreateCampaign);
router.post('/create-campaign', isAuthenticated, isRole('admin'), singleFileUpload,adminController.postCreateCampaign);
router.get('/update-user-proifle',isAuthenticated,isRole('admin'),adminController.getProfileUpdate)
router.post('/update-user-profile',isAuthenticated,isRole('admin',adminController.postProfileUpdate));

module.exports = router;

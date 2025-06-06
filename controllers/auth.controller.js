// controllers/authController.js
const User = require('../models/user.models');
const NgoProfile = require('../models/ngoProfile.models');
const Campaign = require('../models/campaign.models');
// const Organization = require('../models/organization.models');
const { uploadOnCloudinary } = require('../utils/cloudinary');
const fs = require('fs');
const bcrypt = require('bcrypt');
exports.home = async (req,res) => {
  const causes = await Campaign.find()
  .populate('ngo');
    res.render('home.ejs',{causes});
}

exports.getRegister = (req, res) => {
  res.render('auth/register', { errorMessage: "" });
};


exports.postRegister = async (req, res) => {
  try {
    // console.log("req : ",req);
    // console.log("req.files : ",req.files);
    const path = await req.files.registrationCertificate[0].path;;
    const response = await uploadOnCloudinary(path);
    if(response) fs.unlinkSync(path);
    // Destructure with default values to prevent undefined errors
    // console.log("req.body : ",req.body);
    const {
      name = '',
      email = '',
      password = '',
      role = '',
      organizationName = '',
      organizationType = '',
      registrationNumber = '',
      website = ''
    } = req.body;

    // Basic validation
    if (!name || !email || !password || !role) {
      return res.status(400).render('auth/register', {
        errorMessage: 'Please fill all required fields',
        formData: req.body
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // Additional validation for NGOs
    if (role === 'ngo' && (!organizationName || !registrationNumber)) {
      return res.status(400).render('auth/register', {
        errorMessage: 'NGO name and registration number are required',
        formData: req.body
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).render('auth/register', {
        errorMessage: 'Email already exists',
        formData: req.body
      });
    }

    // Handle file uploads if present
    let logoPath = '';
    if (req.files?.logo) {
      logoPath = `/uploads/${req.files.logo[0].filename}`;
    }
    console.log('logo',logoPath);

    // Create new user
    const newUser = new User({
      name,
      email,
      password:hashedPassword,
      role
    });

    const savedUser = await newUser.save();
    
    if(role === 'ngo'){
      const newNgo = new NgoProfile({
        user:savedUser._id,
        organizationName,
        organizationType,
        registrationNumber,
        website,
        logo: logoPath,
        certificate:response.url
      })

      await newNgo.save();
    }
    // Redirect or respond
    // req.flash('success', 'Registration successful! Please login');
    let succes = ""
    if(role === "ngo"){
      success="Registration successful! Wait till verification completed"
    }else{
      success = "Registration successful! Please login"
    }
    res.render('auth/login',{success,errorMessage:""});
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).render('auth/register', {
      errorMessage: 'Registration failed. Please try again.',
      formData: req.body
    });
  }
};

exports.getLogin = (req, res) => {
  res.render('auth/login',{success:"",errorMessage:""});
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      // User not found
      return res.render('auth/login', {success:'' ,errorMessage: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      // Password incorrect
      return res.render('auth/login', {success:'' , errorMessage: 'Invalid email or password' });
    }

    // Set session
    req.session.userId = user._id;
    req.session.role = user.role;
    // Redirect based on role
    if (user.role === 'ngo') {
      const ngoProfile = await NgoProfile.findOne({ user: user._id });
      if (!ngoProfile || !ngoProfile.isVerified) {
        // req.flash('error', 'Your NGO is not verified yet');
        return res.render('auth/login',{success:"",errorMessage:"Not Verified yet"}); // ✅ return here!
      }
      return res.redirect('/ngo/dashboard'); // ✅ return here too!
    } else if (user.role === 'donor') {
      return res.redirect('/donor/dashboard');
    } else if (user.role === 'admin') {
      return res.redirect('/admin/dashboard');
    } else {
      return res.redirect('/');
    }
  } catch (err) {
    console.error(err);
    return res.render('auth/login', {success:'' , errorMessage: 'Server error. Please try again later.' });
  }
};

exports.getCauses = async (req, res) => {
  try {
    // 1. Fetch campaign data from database
    const campaign = await Campaign.findById(req.params.id)
      .populate('organization')
      .populate('updates');

    if (!campaign) {
      return res.status(404).render('error', { 
        message: 'Campaign not found' 
      });
    }

    // 2. Calculate days left (if needed)
    const daysLeft = Math.ceil(
      (new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24)
    );

    // 3. Render the view WITH the campaign data
    res.render('causes', { 
      campaign: {
        ...campaign._doc,
        daysLeft: daysLeft > 0 ? daysLeft : 0
      }
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).render('error', { 
      message: 'Server error' 
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

exports.getAbout = (req,res) =>{
  res.render('about');
}

exports.getContact = (req,res) =>{
  res.render('contact');
}
exports.getRecommended = (req,res) =>{
  res.render('contact');
}

exports.getCauses = (req,res) => {
  res.render('causes');
}

exports.getNgos = async(req,res) => {
  const ngos = await NgoProfile.find({isVerified:true});
  res.render('ngo/Listngos',{ngos});
}

exports.getCampaignDetails = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)

    if (!campaign) {
      return res.status(404).render('error', { 
        message: 'Campaign not found' 
      });
    }

    // Calculate days left
    const daysLeft = Math.ceil(
      (new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24)
    );

    res.render('campaignDetails', { 
      campaign: {
        ...campaign._doc,
        daysLeft: daysLeft > 0 ? daysLeft : 0
      }
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).render('error', { 
      message: 'Server error' 
    });
  }
}

exports.getCauseById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('organization')
      .populate('updates');

    if (!campaign) {
      return res.status(404).render('error', { 
        message: 'Campaign not found' 
      });
    }

    // Calculate days left
    const daysLeft = Math.ceil(
      (new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24)
    );

    res.render('causes', { 
      campaign: {
        ...campaign._doc,
        daysLeft: daysLeft > 0 ? daysLeft : 0
      }
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).render('error', { 
      message: 'Server error' 
    });
  }
}
exports.getCauses = async (req, res) => {
  try {
    // Fetch all campaigns from the database
    const campaigns = await Campaign.find()
      .populate('ngo');
      // .populate('updates');

    // Render the view with the campaigns data
    res.render('causes', { campaigns });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).render('error', { 
      message: 'Server error' 
    });
  }
}
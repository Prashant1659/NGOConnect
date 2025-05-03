const NgoProfile = require('../models/ngoProfile.models');
// middlewares/authMiddleware.js
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
      next();
    } else {
      res.redirect('/login');
    }
  }
  
  function isRole(role) {
    return (req, res, next) => {
      if (req.session.role === role) {
        next();
      } else {
        res.status(403).send('Access Denied');
      }
    };
  }

  function verifiedNgo(req, res, next) {
    if(req.session.role === 'ngo'){
    NgoProfile.findOne({ user: req.session.userId })
      .then(data => {
        if (!data?.isVerified) {
          req.user = "verifiedngo";
          return res.render('auth/login',{success:"",errorMessage:"Not verified yet"});
        }
        next();
      })
      .catch(err => {
        console.error(err);
        res.render('auth/login',{success:'',errorMessage:"Verification failed!! try again"});
      });
    }else{
    next();
    }
  }
  

  module.exports = {
    isAuthenticated,
    isRole,
    verifiedNgo
  };
  
const passport = require('passport');

const passportLocal = require('passport-local').Strategy;

const Admin  = require('../models/Admin');

const bcrypt = require('bcrypt');

passport.use('admin-login',new passportLocal({
    usernameField : 'email'
}, async function(email,password,done){
     let admin = await Admin.findOne({email : email});
      if(admin){
            let matchPassword = await bcrypt.compare(password, admin.password);

            if(!admin || !matchPassword){
                return done(null,false);
            }
            return done(null,admin);
        }
        else{
            return done(null,false);
        }
}))


passport.serializeUser(function(admin,done){
     return done(null,admin.id);
})

passport.deserializeUser(async function(id, done){
    let AdminData = await Admin.findById(id);
    if(AdminData){
        return done(null,AdminData);
    }
    else{
        return done(null,false);
    }
})

passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        res.locals.admin = req.user;
    }
    next();
}

passport.checkAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        next();
    }
    else{
        return res.redirect('/');
    }
}


module.exports = passport;
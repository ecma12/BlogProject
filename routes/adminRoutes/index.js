const express = require('express');

const routes = express.Router();

const passport = require('passport');

const Admin = require('../../models/Admin');

const AdminController = require('../../controllers/AdminController/adminController');

routes.get('/', AdminController.login);

routes.get('/dashboard',passport.checkAuthenticatedUser, AdminController.dashboard);

routes.get('/add_record',passport.checkAuthenticatedUser, AdminController.addAdmin);

routes.get('/view_record',AdminController.viewRecords);

routes.post('/insertAdminRecord', Admin.uploadedAvatar,AdminController.insertAdminRecord);

routes.post('/checkLogin',passport.authenticate('admin-login',{failureFlash :  "Invalid email & password",failureRedirect : "/"}),AdminController.checkLogin);

routes.get('/logout', async (req,res,next)=>{
    req.logout(function(err){
        if(err){
            console.log(err);
        }
        next();
    });
    return res.redirect('/');
})

routes.get('/profile',  async (req,res) =>{

    if(req.cookies.adminData == 'undefined')
    {
        return res.redirect('/');
    }

    let AdminData = req.cookies.adminData;
    return res.render('profile',{
        'adminRecord' : AdminData
    })
})

routes.get('/changePassword', async (req,res)=>{
    if(req.cookies.adminData == 'undefined')
    {
        return res.redirect('/');
    }

    return res.render('change_password');
})

routes.post('/updatePassword', AdminController.updatePassword);

routes.use('/slider', passport.checkAuthenticatedUser,require('./slider'));

routes.use('/blogs', passport.checkAuthenticatedUser, require('./blogs'));

routes.get('/checkEmail', async (req,res)=>{
    return res.render('forget_password',{layout: 'forget_password'});
})

routes.post('/CheckEmailDb',AdminController.CheckEmailDb);

routes.get('/otp',function(req,res){
    return res.render('otp', {layout: 'otp'});
})

routes.post('/checkOTP', AdminController.checkOTP);

routes.get('/uPassword', (req,res)=>{
    return res.render('updatePassword', {layout: 'updatePassword'});
})

routes.post('/updatePassword', AdminController.updatePassword);

routes.use('/user', require('../userRoutes/index'));

module.exports = routes;

const Admin = require('../../models/Admin');

const bcrypt = require('bcrypt');

const nodemailer = require('nodemailer');
const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Calcutta'
  });


module.exports.login = async  ( req,res)=>{
    // console.log(req.cookies.adminData);

   
        if(req.isAuthenticated()){
            return res.redirect('/dashboard');
        }
        return res.render('admin_login',{layout: 'admin_login'});
   
}

module.exports.dashboard = async (req,res) =>{
    // if(req.cookies.adminData != undefined)
    // {

     
        return res.render('dashboard');
    // }
    // else{
    //     return res.redirect('/');
    // }
}


module.exports.addAdmin = async (req,res)=>{
    // if(req.cookies.adminData != undefined){
        return res.render('Add_record');
    // }
    // else{
    //     return res.redirect('/');
    // }
}


module.exports.viewRecords = async (req,res)=>{

    if(req.query.active ==1){
        console.log(req.query.aid);
        let dataDeactive = {isActive : false} 
        let SetDeactive = await Admin.findByIdAndUpdate(req.query.aid,dataDeactive);
    }

    if(req.query.deactive ==0){
        console.log(req.query.aid);
        let dataDeactive = {isActive : true} 
        let SetDeactive = await Admin.findByIdAndUpdate(req.query.aid,dataDeactive);
    }

   var search = '';
   if(req.query.search){
    search = req.query.search;
   }
   var page = 1;
   if(req.query.page){
      page = req.query.page;
   }
   const per_page = 2;

    let adminData = await Admin.find({
        $or : [
            {name : {$regex : '.*'+search+'.*', $options : 'i'}},
            {city : {$regex : '.*'+search+'.*', $options : 'i'}}
        ]
    })
    .limit(per_page*1)
    .skip((page-1)*per_page)
    .exec();
    
    let Countdata = await Admin.find({
        $or : [
            {name : {$regex : '.*'+search+'.*', $options : 'i'}},
            {city : {$regex : '.*'+search+'.*', $options : 'i'}}
        ]
    }).countDocuments();

    return res.render('view_record',{
        'adminRecord' : adminData,
        'totalPage' : Math.ceil(Countdata/per_page),
        'searchData' : search,
        'pageNO' : page 
       
    });
}

module.exports.insertAdminRecord = async(req,res)=>{
    let name = req.body.fname+" "+req.body.lname;
    req.body.name = name;
    let imagePath = '';
    if(req.file){
        imagePath = Admin.avatarPath+"/"+req.file.filename;
    }
    req.body.avatar = imagePath;
    req.body.isActive = true;
    req.body.createdAt = nDate;
    req.body.updatedAt = nDate;

    const hashPassword = await bcrypt.hash(req.body.password,10);
    // console.log(hashPassword);
    req.body.password = hashPassword;

    let adminData = await Admin.create(req.body);
    if(adminData){
        req.flash('success', "Admin Record inserted successfully")
        return res.redirect('/add_record')
    }
    else{
        req.flash('error', "Something wrong");
        return res.redirect('/add_record')
    }

}


module.exports.checkLogin = async (req,res)=>{
    req.flash('success', "Login Successfully");
    return res.redirect('/dashboard');
    // let AdminData = await Admin.findOne({email:req.body.email});
    // if(AdminData && AdminData.password == req.body.password){
        
    //     res.cookie('adminData',AdminData);
        
    // }
    // else{
    //     return res.redirect('/');
    // }
}


module.exports.updatePassword = async (req,res)=>{
    let adminData = req.cookies.adminData;
    console.log(adminData);
    if(adminData.password == req.body.cpass)
    {
        if(req.body.cpass != req.body.npass)
        {
            if(req.body.npass == req.body.copass)
            {
                let oldRecord = await Admin.findById(adminData._id);
                if(oldRecord){
                    let chpas = await Admin.findByIdAndUpdate(oldRecord.id,{
                        password : req.body.npass
                    });

                    res.cookie('adminData', undefined);
                    return res.redirect('/');

                }   
                else{
                    return res.redirect('/changePassword')
                }

            }
            else{
                return res.redirect('/changePassword');
            }
        }
        else{
            return res.redirect('/changePassword');
        }
    }
    else
    {
        return res.redirect('/changePassword');
    }
}


module.exports.CheckEmailDb = async (req,res) =>{
    let CheckEmail = await Admin.findOne({email : req.body.email});
    if(CheckEmail){
        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "f0456b82d1f8de",
              pass: "02803f446ecda8"
            }
          });

          var otp = Math.ceil(Math.random()*1000);
          res.cookie('otp', otp);
          res.cookie('email',req.body.email);

          let info = await transport.sendMail({
            from: 'piyush0101nakarani@gmail.com', // sender address
            to:  req.body.email, // list of receivers
            subject: "Appointment", // Subject line
            text: "OTP send", // plain text body
            html: `<b> Your OTP : ${otp}</b>`, // html body
          });

          return res.redirect('/otp')
    }
    else{
        req.flash('error', "Email is not valid")
        return res.redirect('back');
    }
}


module.exports.checkOTP = (req,res) =>{
    console.log(req.body);
    let chOTP  = req.cookies.otp;
    if(req.body.otp === chOTP){
        return res.redirect('/uPassword');
    }
    else{
        req.flash("error", "OTP not match");
        return res.redirect('back');
    }
}

module.exports.updatePassword = async (req,res)=>{
    console.log(req.body);
    if(req.body.npass == req.body.cpass){
        let email = req.cookies.email;
        let checkAdminData = await Admin.findOne({email : email});
        if(checkAdminData){
            const hashPassword = await bcrypt.hash(req.body.npass,10);
            let updateData = await Admin.findByIdAndUpdate(checkAdminData.id,{password : hashPassword});
            if(updateData){
                req.flash("success","password updated");
                
                return res.redirect('/');
            }
            else{
                req.flash("error","Password not updated");
                return res.redirect('back');
            }
        }
        else{
            req.flash("error","email not found");
        return res.redirect('back');
        }
    }
    else{
        req.flash("error","password and new password not match");
        return res.redirect('back');
    }

}


module.exports.showData = async (req,res) =>{
    console.log("hi");
}
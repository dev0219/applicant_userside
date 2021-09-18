let UserModel=require('../models/users');
let ApplicantModel = require("../models/Applicant")
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const passport = require('passport');
const sendEmail = require("./sendEmail");
const Token = require("../models/token");
const BASE_URL = 'https://apply.insure/dashboard';
exports.create = function(req, res, next) {
    if(req.isAuthenticated()){
        return  res.redirect('/moderator/index');
    }
    res.render('moderator/register', { title: 'UserModel'});
};
exports.login = function(req, res, next) {
    if(req.isAuthenticated()){
        return res.redirect('/moderator/index');
    }
    res.render('moderator/login', { title: 'UserModel'});
};


///login process

exports.forgotpasswordemail = async function(req, res, next){

    const user = await UserModel.findOne({ email: req.body.email });
    
    if (!user)
            return res.status(400).send("user with given email doesn't exist");

        let token = await Token.findOne({ _id: user._id });
        if (!token) {
            token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(64).toString('hex'),
            }).save();
        }

        const link = `${BASE_URL}/password-reset/${token.token}`;
        await sendEmail(user.email, "Password reset", link).then(response=>res.send({response}));
}
exports.resetpassword = async function (req, res , next){
    let id = req.body.id;
    bcrypt.genSalt(10, async function(err, salt){
        bcrypt.hash(req.body.newpassword, salt, async function(err, hash){
            if(err)    console.log(err);
            let query = {_id:id};
            let password = {password:hash};
            await UserModel.update(query,password);
            res.send({ status: 0, message: "OK" });
        });
    });
}
exports.getuserid = async function(req, res, next){
   const userid = await Token.findOne({token:req.body.token})
   if (!userid)
            return res.status(200).send("Token is no correct");
    res.send({userid:userid.userId})
};
exports.login_post = async function(req, res, next){
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user)
            return res.status(200).send("user with given email doesn't exist");
    bcrypt.compare(req.body.password, user.password, function(err, isMatch) {
        if (err) {
            throw err
        } else if (!isMatch) {
            return res.status(200).send("The password is not correct!")
        } else {
            return res.status(200).send({user:user});
        }
    })
};


exports.global=function(req,res,next){
    //res.send('success');
    console.log("success");
}

//logout
exports.logout = function(req, res){
    req.logout();
    return res.redirect('/moderator');
};
exports.all = async function(req, res, next) {  
    let data = await UserModel.find({role:0});
    res.send(data);   
};

exports.store = async function(req, res, next) {
    const defaultpassword = 123456;
    const registerdate = Date.now();
    let newUserModel = new UserModel({
        firstname:req.body.firstname,
        lastname:req.body.lastname,        
        password: defaultpassword,
        email: req.body.email,   
        phone:req.body.phone,
        agentimage:req.body.agentimage,
        agencyimage:req.body.agencyimage,
        link:req.body.link,
        agencyname:req.body.agencyname,
        role:req.body.role,    
        additional_email:'',
        api_status:"no",
        spreadsheet_id:'',
        emailtext:'',
        full_app_sheet_id:'',
        plymouth_api:'',
        universal_api:'',
        stillwater_api:'',
        neptuneflood_api:'',
        havenlife_api:'',
        ethoslife_api:'',
        hippo_api:'',
        created_at:registerdate 
    });
    await bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newUserModel.password, salt, function(err, hash){
            if(err)    console.log(err);
            newUserModel.password = hash;
            newUserModel.save(function(err){
                if(err){
                    console.log(err);   res.send({ status: 1, message: "Fail" });
                } else {
                    res.send({ status: 0, message: "OK" });
                }
            });
        });
    });
};
exports.statusupdate = async function(req, res, next) { 
    let applicantitem = req.body;
    let applicantquery = {_id:applicantitem.id};
    let statusupdatequery = {status:applicantitem.status};
    await ApplicantModel.update(applicantquery,statusupdatequery);
    res.send("Updated status");
}
exports.userupdate = async function(req, res, next) { 
    let curmoderator=req.body;
    let query = {_id:curmoderator.id};
   
    await UserModel.update(query,curmoderator);
    res.send("updated")
    
};

exports.allapplicant = async function(req, res, next) { 
    let data = await ApplicantModel.find({});
    res.send(data); 
};
exports.getuser = async function(req, res, next) { 
    let query = {_id:req.body.id};   
    var user = await UserModel.findOne(query);   
    res.send(user)    
};
exports.delete = async function(req, res, next) { 
    let curmoderator=req.body;
    await UserModel.deleteOne({_id:curmoderator.id});
    res.send("deleted")
    
};
exports.alldelete = async function(req, res, next) { 
    await UserModel.deleteMany({role:0});
    res.send("deleted")
    
};

///profiles
exports.profile = async function(req, res, next) { 
    let curmoderator=req.user;
    let moderator_data=await UserModel.findOne({_id:curmoderator.id});
    res.render('moderator/profile', { title: 'UserModel', moderator:moderator_data, curmoderator:curmoderator}); 
};

///update profiles
exports.profile_update = async function(req, res, next) {
    let curmoderator=req.user;  
    let moderator={};
    moderator.phone_number=req.body.phone;
    moderator.introduce=req.body.introduce_text;
    moderator.location=req.body.location;
    moderator.nickname=req.body.nickname;
    let query={_id:curmoderator.id};
    await UserModel.update(query, moderator);

    //...
    req.session.passport.user = await UserModel.findOne({_id:curmoderator.id});

    return res.redirect('/moderator/profile');
    
};
  
///settings
exports.settings = async function(req, res, next) {
    let curmoderator=req.user;
    res.render('moderator/settings', { title: 'UserModel', moderator_id:curmoderator.id, moderator_password:curmoderator.password, 
    moderator_name:curmoderator.name, curmoderator:curmoderator});  
};

//index
exports.index = function(req, res, next) {
    let curmoderator=req.user;
    res.render('moderator/index', { title: 'moderator', moderator_name:curmoderator.name,curmoderator:curmoderator });   
};

exports.re_password = async function(req, res, next) {
    let curmoderator=req.user;  

    let new_password = req.body.new_password;
    let old_password = req.body.old_password;

    req.checkBody('old_password', 'Old Password is required').notEmpty();
    req.checkBody('new_password', 'Password is required').notEmpty();
    req.checkBody('new_password_confirm', 'Passwords do not match').equals(new_password);
    let errors = req.validationErrors();
    if (errors){
        res.render('moderator/settings',{ errors:errors, curmoderator:curmoderator});
        return;
    } 
    let moderator=curmoderator;

    let issame = await bcrypt.compare(old_password, moderator.password);
    if(issame){
        console.log("Old Password is same");
    }else{
        console.log("Old Password is not correct!");        
        res.render('moderator/settings', {errors: [{'msg':'Old Password is not correct!'}], curmoderator:curmoderator});
        return;
    }

    bcrypt.genSalt(10, async function (err, salt) {
        bcrypt.hash(new_password, salt, async function (err, hash) {
            if(err) {
                console.log(err); return;
            }          
            moderator.password = hash;          
            let query={_id:curmoderator.id};                        
            await UserModel.update(query,moderator);
            req.flash('success', 'Change your password successfully');
            return res.redirect('/moderator/logout');
        });
    });
  
   
};


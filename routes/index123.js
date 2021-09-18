let express = require('express');
let router = express.Router();
const request = require('request');
let config = require('../config');
var unirest = require("unirest");
// let mongoose = require('mongoose');
// let User = require('../models/User.js');
// let Group = require('../models/Group.js');
// let Link = require('../models/Link.js');
const multer = require('multer');
let Applicant = require('../models/Applicant.js');
const swig = require('swig');
const sgMail = require('@sendgrid/mail');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const mv = require('mv');
const jwt = require('express-jwt');
const formidable = require('formidable');
const NeptuneFlood = require('../controllers/neptune_flood');
const HavenLife = require('../controllers/haven_life');
const StillWater = require('../controllers/stillwater');
const Universal = require('../controllers/universal');
const Plymouth = require('../controllers/plymouth');
const Ethoslife = require('../controllers/ethoslife');
const Hippo = require("../controllers/hippo");
const CommonHelper = require('../helpers/common-helper');
const nodemailer = require("nodemailer");
const commonHelper = new CommonHelper();
const passport = require('passport');
var mysql = require('mysql');

const auth = jwt({
  secret: config.secret,
  userProperty: 'payload'
});
swig.setDefaults(
  {
    loader: swig.loaders.fs(path.join(__dirname, '../config/templates'))
  }
);

// SMTP settings
let transporter = nodemailer.createTransport({
  host: "email-smtp.us-east-1.amazonaws.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'AKIATLLLZDV4KTA3KNWJ', // generated ethereal user
    pass: 'BEHn+YT2OxRLHHOjuI684clmzCCmIIcNQvC099t4aIPb', // generated ethereal password
  },
});


// SQL Connection.
var con = mysql.createConnection({
  host: "ls-c00483de6386debba18978d5479218a685331e9b.c8otb5ezlasd.us-east-1.rds.amazonaws.com",
  user: "apply",
  password: "Apply2021",
  database: "dbapply"
});
con.connect(function(err) { 
	if (err) res.send(err); 
});

const DIR = './uploads';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({storage: storage});
let ObjectId = require('mongodb').ObjectId;
sgMail.setApiKey(config.sendgrid);
router.post('/get_plymouth',
  async function (req, res, next) {
    const plymouth = new Plymouth();
    const data = await plymouth.getPricing(req.body);
    res.json(data);
  }
); 7
router.post('/get_universal',
  async function (req, res, next) {
    const universal = new Universal();
    const data = await universal.getPricing(req.body);
    res.json(data);
  }
);
router.post('/get_stillwater',
  async function (req, res, next) {
    const stillwater = new StillWater();
    const data = await stillwater.getPricing(req.body);
    res.json(data);
  }
);

router.post('/get_ethoslife',
  async function (req, res, next) {
    const ethoslife = new Ethoslife();
    const data = await ethoslife.getPricing(req.body);
    res.json(data);
  }
);

router.post("/get_hippo", async function (req, res, next) {
  const hippo = new Hippo();
  await hippo.getPrice(req.body).then((e) => {
      res.send(e);
    }).catch((e) => {
      res.send(e);
    });
});

router.post('/get_neptuneflood', async function (req, res, next) {
    const neptune = new NeptuneFlood();
    await neptune.createQuote(req.body).then((apiResponse) => {
        data = {},
        result = "success";
        // console.log(apiResponse);
        data["zone"] = apiResponse.body["application"]["floodZone"];
        data["premium"] = apiResponse.body["policy"]["totalPremium"];
        res.json({ result, data })
    }).catch(data => res.send(data))
  }
);
router.post('/get_havenlife',
  async function (req, res, next) {
    const havenLife = new HavenLife();
    const data = await havenLife.generateToken(req.body);
    res.send(data);
  }
);

/* GET ALL Zillow data*/
/* Now replaced with realtor api*/
router.post('/get_zillow', async (req, response, next) => {
  let { address, citystatezip } = req.body;

  if (address) {
    var req = unirest("GET", config.RealtorConfig.endpoint.location_lookup);

    req.query({
      "input": address + ',' + citystatezip
    });

    req.headers(setRapidApiHeader());

    await req.end(async function (res) {
      if (res.error) throw new Error(res.error);
      const { mpr_id } = res.body.autocomplete && res.body.autocomplete[0] || null;
      return getPropertyInfo(mpr_id).then((val) => {
        response.send(val);
      }).catch(() => {
        response.send(null);
      })

    });
  } else {
    response.send(null);
  }
});

router.post('/register', function (req, res, next) {
  let {name, email, phone, link, label, password, mode, _id, profilePic, loginId, isChangePwd, curPwd} = req.body;
  User.find({email: email}, function (err, user) {
    if (err) {
      res.render('error');
    } else {
      if (mode == 0) {
        if (user.length > 0) {
          res.send({status: 'error', msg: 'Same user already exists.'});
        } else {
          let user = new User();
          if (req.body.email == config.adminEmail) {
            user.is_admin = true;
          }
          user.name = name;
          user.email = email;
          user.phone = phone;
          user.link = link;
          user.profilePic = profilePic;
          user.label = label;
          user.setPassword(password);
          user.save(function (err) {
            let token;
            token = user.generateJwt();
            res.status(200);
            res.json({
              "token": token,
              "status": "success",
              "msg": "Successfully saved."
            });
          });
        }
      } else if (mode == 1) {
        let userid = new ObjectId(_id);
        User.find({_id: userid}, function (err, user) {
          if (err) {
            res.render('error');
          } else {
            if (!isChangePwd) {
              user[0].name = name;
              user[0].email = email;
              user[0].label = label;
              user[0].phone = phone;
              if (profilePic != '' && profilePic != undefined) {
                if (user[0].profilePic != '' && user[0].profilePic != undefined) {
                  try {
                    fs.unlinkSync(DIR + '/' + user[0].profilePic);
                  } catch (e) {
                    console.log(e);
                  }
                }
                user[0].profilePic = profilePic;
              }
              if (link != '' && link != undefined) {
                user[0].link = link;
              }
            } else {
              if (user[0].validPassword(curPwd)) {
                if (password != '' && password != undefined) {
                  user[0].setPassword(password);
                }
              } else {
                res.send({status: 'error', msg: 'Current Password is incorrect.'});
                return;
              }
            }
            user[0].save(function (err) {
              if (err) {
                res.send({'status': 'err', 'msg': 'An error occured. Please try again later.'});
                return;
              }
              let data = {
                status: 'success',
                msg: 'Successfully updated.'
              };
              res.status(200);
              if (_id == loginId) {
                let token;
                token = user[0].generateJwt();
                data['token'] = token;
              }
              res.json(data);
            });
          }
        })
      }
    }
  })
});

router.post('/add_group', function (req, res, next) {
  let {name, value, user_id, _id, mode} = req.body;
  Group.find({name: name, user_id: user_id}, function (err, group) {
    if (err) {
      res.render('error');
    } else {
      if (mode == 0) {
        if (group.length > 0) {
          res.send({status: 'error', msg: 'Same group already exists.'});
        } else {
          let group = new Group();
          group.name = name;
          group.value = value;
          group.user_id = user_id;
          group.save();
          res.send({status: 'success', msg: 'Successfully Saved.'});
        }
      } else if (mode == 1) {
        let groupid = new ObjectId(_id);
        Group.find({_id: _id}, function (err, group) {
          if (err) {
            res.render('error');
          } else {
            group[0].name = name;
            group[0].value = value;
            group[0].user_id = user_id;
            group[0].save(function (err) {
              if (err) {
                res.send({'status': 'err', 'msg': 'An error occurred. Please try again later.'});
                return;
              }
              let data = {
                status: 'success',
                msg: 'Successfully updated.'
              };
              res.send(data);
            });
          }
        })
      }
    }
  })
});

router.post('/delete_group', function (req, res, next) {
  let {id} = req.body;
  Group.remove({_id: ObjectId(id)}, function (err, group) {
    if (err) {
      res.render('error');
      return;
    } else {
      if (group['ok'] > 0) {
        res.send({'status': 'success', 'msg': 'Successfully deleted.'});
      }
    }
  })
});

router.post('/get_groups', function (req, res, next) {
  let {user_id} = req.body;
  Group.find({user_id: user_id}, function (error, group) {
    if (error) {
      res.send({status: 'error', msg: 'An error occurred.'});
    } else {
      res.send({status: 'success', msg: 'successfully saved', data: group})
    }
  })
});

router.post('/upload-logo', upload.single('logo'), function (req, res) {
  if (!req.file) {
    console.log("No file received");
    return res.send({
      success: false
    });

  } else {
    console.log('file received');
    return res.send({
      success: true,
      name: req.file.filename
    })
  }
});

router.post('/upload-doc', upload.single('doc'), function (req, res) {
  const previousFile = req.body.prevFile;
  if (!req.file) {
    return res.send({
      success: false
    });

  } else {
    if (previousFile) {
      const filePath = DIR + '/' + previousFile;
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    return res.send({
      success: true,
      name: req.file.filename
    })
  }
});

router.post('/add_link', function (req, res, next) {
  let {name, label, mode, _id} = req.body;

  Link.find({name: name}, function (error, link) {
    if (error) {
      res.send({status: 'error', msg: 'failed'});
    } else {
      if (link.length > 0) {
        if (link[0]['_id'] == _id && _id != undefined) {
          saveFunc();
        } else {
          res.send({status: 'error', msg: 'Same data already exists.'});
        }
      } else {

        saveFunc();
      }
    }
  });

  function saveFunc() {
    if (_id == undefined) {

      let link = new Link();
      link.name = name;
      link.label = label;
      link.save();
      res.send({status: 'success', msg: 'Successfully saved.'});
    } else {
      Link.find({_id: ObjectId(_id)}, function (error, link) {
        if (error) {
          res.send({status: 'error', msg: 'failed'});
        } else {
          link[0].name = name;
          link[0].label = label;
          link[0].save();
          res.send({status: 'success', msg: 'Successfully saved.'});
        }
      });
    }
  }

});

router.get('/check_admin', function (req, res, next) {
  res.send({status: 'success', result: false});
  /* User.find({is_admin: true}, function (err, user) {
	res.send({status: 'success', result: false});
     if (err) {
      res.render('An error occured.');
      return;
    } else {
      if (user.length == 0) {
        res.send({status: 'success', result: false});
      } else {
        res.send({status: 'success', result: true})
      }
    }
  }) */
});

router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    let token;
    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if (user) {
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token": token
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);
});

router.post('/get_statistics', async function (req, res, next) {
  let {_id, groupId} = req.body;
  User.find({_id: ObjectId(_id)}, function (err, user) {
    if (err) {
      res.render('error');
    } else if (user.length > 0) {
      let link;
      if (user[0]['is_admin']) {
        link = user[0]['link'].split(',');
        runQueries(link, true);
      } else {
        runQueries(user[0]['link'].split(','), false);
        // Group.find({_id: ObjectId(groupId)}, function (error, group) {
        //   console.log(group);
        //   if (error) {
        //     res.render('error');
        //   } else {
        //     runQueries(group[0]['value'].split(','));
        //   }
        // })
      }
    }
  });

  async function runQueries(link, is_admin) {
    let data = [];
    let linkQuery;
    let links;
    if (groupId == -1) {
      if (is_admin) {
        linkQuery = Link.find();
        links = await linkQuery.exec();
        getResult(links);
      } else {
        linkQuery = Link.find({_id: {$in: link}})
        links = await linkQuery.exec();
        getResult(links);
      }
    } else {
      Group.find({_id: ObjectId(groupId)}, function (err, group) {
        if (err) {
          res.send({'status': 'An error occured'});
        } else {
          let linkAry = group[0]['value'].split(',');
          Link.find({_id: {$in: linkAry}}, function (error, link) {
            if (error) {
              res.send({status: 'error'});
            } else {
              getResult(link);
            }
          });
        }
      })
    }

    async function getResult(links) {
      let applicantsCondition = [];

      for (let condition of links) {
        applicantsCondition.push(condition['name']);
      }

      const applicantsQuery = Applicant.distinct('link', {link: {$in: applicantsCondition}});
      const applicants = await applicantsQuery.exec();
      let date = new Date();
      let currentMonth = date.getMonth();
      let currentDate = date.getDate();
      let currentYear = date.getFullYear();
      let dateYTD = new Date(date.getFullYear(), 0, 1);
      let date90 = (new Date()).setDate(date.getDate() - 90);
      let date30 = (new Date()).setDate(date.getDate() - 30);
      let date7 = (new Date()).setDate(date.getDate() - 7);
      let date1 = (new Date()).setDate(date.getDate() - 1);
      if (applicants.length > 0) {
        await applicants.forEach(async function (applicant, index) {
          let label = await links.filter(function (elem) {
            return elem.name == applicant;
          });

          label = label.length > 0 ? label[0]['label'] : '';

          let countQuery = Applicant.count({link: applicant});
          let oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
          let firstDate = new Date(dateYTD);
          let secondDate = new Date();
          let diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
          let count = await countQuery.exec();
          let countYTDQuery = Applicant.count({
            link: applicant,
            register_date: {"$gte": dateYTD, "$lt": new Date()}
          });
          let countYTD = await countYTDQuery.exec();
          let count90Query = Applicant.count({
            link: applicant,
            register_date: {"$gte": new Date(date90), "$lt": new Date()}
          });
          let count90 = await count90Query.exec();
          let count30Query = Applicant.count({
            link: applicant,
            register_date: {"$gte": new Date(date30), "$lt": new Date()}
          });
          let count30 = await count30Query.exec();

          let count7Query = Applicant.count({
            link: applicant,
            register_date: {"$gte": new Date(date7), "$lt": new Date()}
          });
          let count7 = await count7Query.exec();
          let count1Query = Applicant.count({
            link: applicant,

            register_date: {"$gte": new Date(date1), "$lt": new Date()}
          });
          let count1 = await count1Query.exec();

          let cdate = new Date((new Date()).setFullYear(currentYear - 1));
          let countCYTDQuery = Applicant.count({
            link: applicant,
            register_date: {"$gte": new Date(dateYTD.setFullYear(currentYear - 1)), "$lt": cdate}
          });
          let countCYTD = await countCYTDQuery.exec();

          let countC90Query = Applicant.count({
            link: applicant,
            register_date: {"$gte": new Date((new Date(date90)).setFullYear(currentYear - 1)), "$lt": cdate}
          });
          let countC90 = await countC90Query.exec();
          let countC30Query = Applicant.count({
            link: applicant,
            register_date: {"$gte": new Date((new Date(date30)).setFullYear(currentYear - 1)), "$lt": cdate}
          });
          let countC30 = await countC30Query.exec();

          let countC7Query = Applicant.count({
            link: applicant,
            register_date: {"$gte": new Date((new Date(date7)).setFullYear(currentYear - 1)), "$lt": cdate}
          });
          let countC7 = await countC7Query.exec();
          let countC1Query = Applicant.count({
            link: applicant,

            register_date: {"$gte": new Date((new Date(date1)).setFullYear(currentYear - 1)), "$lt": cdate}
          });
          let countC1 = await countC1Query.exec();

          data.push({
            link: applicant,
            label: label,
            count: count,
            countYTD: countYTD,
            count90: count90,
            count30: count30,
            count7: count7,
            count1: count1,
            countCYTD: countCYTD,
            countC90: countC90,
            countC30: countC30,
            countC7: countC7,
            countC1: countC1,
            diffDays: diffDays
          });
          if (index == applicants.length - 1) {
            await setTimeout(function () {
              res.send({'status': 'success', 'data': data});
            }, 2000);
          }
        });
      } else {
        res.send({status: 'success', data: []});
      }
    }
  }
});

router.post('/getDataByID', function (req, res, next) {
  let {id, groupId} = req.body;
  User.find({_id: ObjectId(id)}, function (err, user) {
    if (err) {
      res.render('error');
    } else if (user.length > 0) {

      if (groupId == '-1') {

        let link = user[0]['link'].split(',');
        runQueries(link);
      } else {
        Group.find({_id: ObjectId(groupId)}, function (error, group) {
          if (error) {
            res.render('error');
          } else {
            runQueries(group[0]['value'].split(','));
          }
        })
      }

      function runQueries(link) {
        let link_query = [];
        Link.find({_id: {$in: link}}, function (err, link) {
          if (link != undefined) {
            for (let item of link) {
              link_query.push(item['name']);
            }
          }
          if (user[0]['is_admin'] && groupId == '-1') {
            Applicant.find(function (err, applicant) {
              if (err) {
                res.render('error');
              } else {
                res.send({data: applicant, is_admin: user[0]['is_admin']});
              }
            })
          } else {
            Applicant.find({link: {$in: link_query}}, function (err, applicant) {
              if (err) {
                res.render('error');
              } else {
                res.send({data: applicant, is_admin: user[0]['is_admin']});
              }
            })
          }
        })
      }

    } else {
      res.send({data: [], is_admin: false})
    }
  })
});

router.post('/getUserByID', function (req, res, next) {
  let {id} = req.body;
  User.find({email: id}, function (err, user) {
    if (err) {
      res.render('error');
      return;
    } else {
      res.send(user);
    }
  })
});

router.post('/getLinkByID', function (req, res, next) {
  let {id} = req.body;
  Link.find({_id: ObjectId(id)}, function (err, user) {
    if (err) {
      res.render('error');
      return;
    } else {
      res.send(user);
    }
  })
});

router.post('/delete_user', function (req, res, next) {
  let {id} = req.body;
  User.remove({email: id}, function (err, user) {
    if (err) {
      res.render('error');
      return;
    } else {
      if (user['ok'] > 0) {
        res.send({'status': 'success', 'msg': 'Successfully deleted.'});
      }
    }
  })
});

router.post('/delete_link', function (req, res, next) {
  let {id} = req.body;
  Link.remove({_id: ObjectId(id)}, function (err, link) {
    if (err) {
      res.render('error');
      return;
    } else {
      if (link['ok'] > 0) {
        res.send({'status': 'success', 'msg': 'Successfully deleted.'});
      }
    }
  })
});

router.post('/send_message', function (req, res, next) {
  let senderName = req.body.contactFormName;
  let senderEmail = req.body.contactFormEmail;
  let messageText = req.body.contactFormMessage;
  let emailHeader = commonHelper.getEmailCommonPart()['header'];
  let emailFooter = commonHelper.getEmailCommonPart()['footer'];
  let html = emailHeader;
  html += "               <tr mc:repeatable=\"item\">\n" +
    "                      <td style=\"padding:0 0 10px;\">\n" +
    "                        <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">\n" +
    "                          <tr>\n" +
    "                            <td mc:edit=\"block_27\" valign=\"top\"\n" +
    "                                style=\"font:14px/24px Verdana, Geneva, sans-serif; color:#3b434a;\">\n" +
    "                              <b style=\"margin-left:10px;\">Name :</b> <span style=\"float: right;\">" + senderName + "</span>\n" +
    "                            </td>\n" +
    "                            <td mc:edit=\"block_27\" valign=\"top\"\n" +
    "                                style=\"font:14px/24px Verdana, Geneva, sans-serif; color:#3b434a;width: 31%;\">\n" +
    "                            </td>\n" +
    "                          </tr>\n" +
    "                        </table>\n" +
    "                      </td>\n" +
    "                    </tr>\n" +

    "                    <tr mc:repeatable=\"item\">\n" +
    "                      <td style=\"padding:0 0 10px;\">\n" +
    "                        <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">\n" +
    "                          <tr>\n" +
    "                            <td mc:edit=\"block_27\" valign=\"top\"\n" +
    "                                style=\"font:14px/24px Verdana, Geneva, sans-serif; color:#3b434a;\">\n" +
    "                              <b style=\"margin-left:10px;\">Message:</b> <span style=\"float: right;\">" + messageText + "</span>\n" +
    "                            </td>\n" +
    "                          </tr>\n" +
    "                        </table>\n" +
    "                      </td>\n" +
    "                    </tr>\n";
  html += emailFooter;
  let subject = "Email from applicant";
  const msg = {
    // from: config.agent_mail,
    // to: config.life_mail,
    to: 'solutionweb79@gmail.com',
    from: senderEmail,
    subject: subject,
    html: html
  };
  sgMail.send(msg);


  res.contentType('json');
  res.send(JSON.stringify({result: "success"}));
});

router.get('/agent', auth, function (req, res) {

  // If no user ID exists in the JWT return a 401
  if (!req.payload._id) {
    res.status(401).json({
      "message": "UnauthorizedError: private profile"
    });
  } else {
    // Otherwise continue
    User
      .findById(req.payload._id)
      .exec(function (err, user) {
        res.status(200).json(user);
      });
  }

});

router.get('/get_all_users', function (req, res, next) {
  User.find({is_admin: false}, function (err, user) {
    if (err) {
      res.render({status: 'error', msg: 'An error occured.'});
    } else {
      res.send(user);
    }
  })
});

router.get('/get_all_links', function (req, res, next) {
  Link.find(function (err, link) {
    if (err) {
      res.render({status: 'error', msg: 'An error occured.'});
    } else {
      res.send(link);
    }
  })
});

router.post('/send_more_email', function (req, res, next) {
  let {address, persons, type, agent, basicPrice, goodPrice, enhancedPrice} = req.body;
  persons = JSON.parse(persons);
  let subject1 = config.agentsInfo[agent['email']]['name'] + " **NQR* - " + address.split(',')[0] + " - " + ((persons[0]['first_name'] + ' ' + persons[0]['last_name']));
  let html = commonHelper.getEmailCommonPart()['header'];
  html += "<tr>\n" +
    "     <td mc:edit=\"block_25\" style=\"padding:0 0 29px; font-family: Verdana, Geneva,sans-serif;\">\n" +
    "       <h3 style=\"color: #3d3d3d;text-align: center\">Client is looking for the insurances: " +
    " </td>\n" +
    "   </tr>";
  html += "<tr mc:repeatable=\"item\">\n" +
    "       <td style=\"padding:0 0 10px;\">\n" +
    "           <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">\n" +
    "             <tr style=\"background-color: #3d3d3d; color: white\">\n" +
    "               <td mc:edit=\"block_27\" valign=\"top\"\n" +
    "                 style=\"font:14px/24px Verdana, Geneva, sans-serif; color:#fff;\">\n" +
    "                   <b style=\"margin-left:10px;\">Basic Plan:</b> " + basicPrice + "\n" +
    "               </td>\n" +
    "             </tr>\n" +
    "           </table>\n" +
    "        </td>\n" +
    "      </tr>\n" +
    "<tr mc:repeatable=\"item\">\n" +
    "       <td style=\"padding:0 0 10px;\">\n" +
    "           <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">\n" +
    "             <tr style=\"background-color: #3d3d3d; color: white\">\n" +
    "               <td mc:edit=\"block_27\" valign=\"top\"\n" +
    "                 style=\"font:14px/24px Verdana, Geneva, sans-serif; color:#fff;\">\n" +
    "                   <b style=\"margin-left:10px;\">Good Plan:</b> " + goodPrice + "\n" +
    "               </td>\n" +
    "             </tr>\n" +
    "           </table>\n" +
    "        </td>\n" +
    "      </tr>\n" +
    "<tr mc:repeatable=\"item\">\n" +
    "       <td style=\"padding:0 0 10px;\">\n" +
    "           <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">\n" +
    "             <tr style=\"background-color: #3d3d3d; color: white\">\n" +
    "               <td mc:edit=\"block_27\" valign=\"top\"\n" +
    "                 style=\"font:14px/24px Verdana, Geneva, sans-serif; color:#fff;\">\n" +
    "                   <b style=\"margin-left:10px;\">Enhanced Plan:</b> " + enhancedPrice + "\n" +
    "               </td>\n" +
    "             </tr>\n" +
    "           </table>\n" +
    "        </td>\n" +
    "      </tr>\n";
  html += commonHelper.getEmailCommonPart()['footer'];
  const msg1 = {
    // to: config.agent_mail
    to: config.agentsInfo[agent['email']]['email'],
    from: config.from,
    subject: subject1,
    html: html
  };
  sgMail.send(msg1).then((res) => {
    console.log(res);
  });
  res.contentType('json');
  res.send(JSON.stringify({result: "success"}));
});

router.post('/send_life_email', function (req, res, next){
  let total_data = req.body;

  const persons = total_data.personData;
  let address = "";
  let postal_code = city = state = "";
  if(total_data.manualAddress == ""){
    if(total_data.address){
      /* address = (total_data.GooglePlace ? (total_data.address.address + ", "
        + total_data.address.locality + ", " + total_data.address.administrative_area_level_1) : total_data.staticAddress); */
      address = total_data.address.address + ", "
        + total_data.address.locality + ", " + total_data.address.administrative_area_level_1;

      postal_code = total_data.address.postal_code;
      city =  total_data.address.locality;
      state = total_data.address.administrative_area_level_1;
    }else{
     address = total_data.address.formatted_address;
    }
  }else{
    address = total_data.manualAddress;
  }
  Applicant.find({quote_id: total_data.quote_id}, function (err, applicant) {
    if (err) {
      res.render('error');
      return;
    }
    if (applicant.length == 0) {
      let applicant = new Applicant();
      applicant.name = persons[0]['first_name'] + ' ' + persons[0]['last_name'];
      //applicant.email = total_data.email;
      applicant.email = '';
      applicant.address = address;
      applicant.quote_id = total_data.quote_id;
      applicant.link = total_data.link;
      applicant.save();
    }
  });
  for(var  i = 0; i < total_data.personData.length; i++) {
    var dob = new Date(total_data.personData[i].birthday);
    total_data.personData[i].birthday = ('0' + (dob.getMonth()+1)).slice(-2)+'-'+('0' + dob.getDate()).slice(-2)+'-'+dob.getFullYear();
  }

  if(total_data.insurence_want != "ASAP"){
    var insurence_want = new Date(total_data.insurence_want);
    total_data.insurence_want =  ('0' + (insurence_want.getMonth()+1)).slice(-2)+'-'+('0' + insurence_want.getDate()).slice(-2)+'-'+insurence_want.getFullYear();
  }

  //  total_data.personData[0].birthday = total_data.personData[0].birthday;
  const detailsEmailTemplate = swig.compileFile('details_email.twig');
  const html1 = detailsEmailTemplate(total_data);


  fs.writeFileSync('./detailsEmailTemplate123.html', html1);


  if(total_data.personData.length){
    subject1 = total_data.agent['name'] + " **NQR* - " + address + " - "
    + (total_data.personData[0]['first_name'] + ' ' + total_data.personData[0]['last_name']);
  }else{
    subject1 = total_data.agent['name'] + " **NQR* - " + address;
  }

  let subject2 = "Quote Request Received! - " + address;
  let agentEmail, agentSubject, agentPhone, agentLink;


  if (typeof total_data.agent['email'] != undefined){
    agentEmail = total_data.agent['email'];
    agentPhone = total_data.agent['phone'];
    agentSubject = total_data.agent['name'];
    agentLink = total_data.agent['link'];
  } else {
    agentEmail = config.agentsInfo['pete']['email'];
    agentPhone = config.agentsInfo['pete']['phone'];
    agentSubject = config.agentsInfo['pete']['name'];
  }

  total_data.agent['logo'] = "https://apply.insure/assets/images/agents/"+total_data.agent['logo'];
  Object.assign(total_data, {agentEmail});
  Object.assign(total_data, {agentPhone});
  Object.assign(total_data, {agentSubject});

  total_data.applicant_email_content = total_data.applicant_email_content.split("<br>").join("\n");
  const thankyouTemplate = swig.compileFile('thankyou.twig');
  const html2 = thankyouTemplate(total_data);

  let additional_email = total_data.agent['additional_email'].trim() != "" ? total_data.agent['additional_email'].replace("|",",") : "";

  /*Send the "Thank you email" to user*/
    const msg2 = {
      from: config.from,
      to: [total_data.email],
      bcc:[agentEmail,additional_email],
      subject: subject2,
      html: html2
    };
    let thankyou = transporter.sendMail(msg2,function(err, info){
      if (err) {
        console.log(err)
      } else {
        console.log(info);
      }
    });

    /*Send the "Quote Request email" to agent*/

    const msg4 = {
      from: config.from,
      to: config.peterEmail,
      subject: 'MASTER ' + subject1,
      html: html1
    };
    /* sgMail.send(msg4).then(() => {
      console.log('Email sent')
    }).catch((error) =>{
      console.log('Error');
      console.log(error)
    }); */
    let mail1 = transporter.sendMail(msg4,function(err,info) {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });

    /*Send the quote email*/
    let to = config.quote_mail;
    const msg1 = {
      from: config.from,
      to: [agentEmail],
      bcc:[additional_email,to],
      subject: subject1,
      html: html1
    };

    let mail2 = transporter.sendMail(msg1,function(err, info) {
      if (err) {
        console.log(err)
      } else {
        console.log(info);
      }
    });

    /* sgMail.sendMultiple(msg1).then(() =>{
      console.log('Email sent')
    }).catch((error) =>{
      console.error(error)
    });  */

  let car_data = "";
  for(let i = 0;i < total_data.carData.length;i++){
    car_data += " ("+(i+1)+")  "+total_data.carData[i]['year']+"  "+total_data.carData[i]['type']+"  "+total_data.carData[i]['model']+"\n";
  }

  var spreadsheet_id = "";
  if (typeof total_data.agent['spreadsheet_id'] != undefined){
    spreadsheet_id = total_data.agent['spreadsheet_id'];
  }

  var short_app_sheet_id = "";
  if (typeof total_data.agent['short_app_sheet_id'] != undefined){
    short_app_sheet_id = total_data.agent['short_app_sheet_id'];
    short_app_sheet_id = short_app_sheet_id.toString().trim();
  }

  let dateofbirth = new Date(persons[0]['birthday']);
  let birthday = ('0' + (dateofbirth.getMonth()+1)).slice(-2)+'-'+('0' + dateofbirth.getDate()).slice(-2)+'-'+dateofbirth.getFullYear();

  // check spreadsheet & short app sheet id availabel the zapier code execute.
  if(spreadsheet_id != "" && short_app_sheet_id != ""){
    // For google sheet / agency zoom entry.
    const qs = {
      "lead":{
        "applicant_name": persons[0]['first_name'] + ' ' + persons[0]['last_name'],
        "applicant_email":total_data.email,
        "applicant_phone":total_data.phone,
        "applicant_dob": birthday,
        "sheet":short_app_sheet_id,
        //"spreadsheet":"1ORbjmquf6Kpi1iTL4fhSwqRKkq8DOp6lTApWig51HTI",
        "spreadsheet":spreadsheet_id,
        "address":address,
        "city":city,
        "state":state,
        "postal_code":postal_code,
        "square_feet":total_data.sqft,
        "built_year":total_data.yearBuilt,
        "basement_finished":total_data.discountsData.claim_free == true ? "Yes":"No",
        "security_system":total_data.discountsData.security_system == true ? "Yes":"No",
        "dog":total_data.discountsData.dog == true ? "Yes":"No",
        "roof_shape":total_data.discountsData.roof_shape == true ? "Yes":"No",
        "carrier_type":total_data.carrier_type,
        "insurence_want":total_data.insurence_want,
        "requestorcomments":total_data.requestorcomments,
        "car_data": car_data,
        "app_type":"short_app"
      }
    };
    const options = {
      url:"https://hooks.zapier.com/hooks/catch/9240331/oxx998g", // For Googlesheet (peter)
      //url:"https://hooks.zapier.com/hooks/catch/9699027/onj89tp", // For Googlesheet Of short App
      //url: "https://hooks.zapier.com/hooks/catch/9240331/oxvhfae", // For Agency Zoom
      body:JSON.stringify(qs),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    var zapier_res = new Promise((resolve, reject) => {
      request(options, function (error, response, body) {
        if (error) {
          console.log(error);
        } else {
          console.log(body);
        }
      });
    });
  }

  res.contentType('json');
  res.send(JSON.stringify({result: "success"}));
});

router.post('/send_advance_life_email', function (req, res, next) {
  let total_data = req.body;
  const persons = total_data.personData;
  let address = "";
  let postal_code = city = state = "";
  if(total_data.manualAddress == ""){
    if(total_data.address){
      address = total_data.address.address + ", "
      + total_data.address.locality + ", " + total_data.address.administrative_area_level_1;

      postal_code = total_data.address.postal_code;
      city =  total_data.address.locality;
      state = total_data.address.administrative_area_level_1;
    }else{
     address = total_data.address.formatted_address;
    }
  }else{
    address = total_data.manualAddress;
  }
  Applicant.find({quote_id: total_data.quote_id}, function (err, applicant) {
    if (err) {
      res.render('error');
      return;
    }

    if (applicant.length == 0 || total_data.personData.length) {
      let applicant = new Applicant();
      applicant.name = persons[0]['first_name'] + ' ' + persons[0]['last_name'];
      applicant.email = total_data.email;
      applicant.address = address;
      applicant.quote_id = total_data.quote_id;
      applicant.link = total_data.link;
      applicant.save();
    }
  });

  if(total_data.personData.length){
    for(var  i = 0; i < total_data.personData.length; i++){
      var dob = new Date(total_data.personData[i].birthday);
      total_data.personData[i].birthday = ('0' + (dob.getMonth()+1)).slice(-2)+'-'+('0' + dob.getDate()).slice(-2)+'-'+dob.getFullYear();
    }
  }


  if(total_data.insurence_want != "ASAP"){
    var insurence_want = new Date(total_data.insurence_want);
    total_data.insurence_want =  ('0' + (insurence_want.getMonth()+1)).slice(-2)+'-'+('0' + insurence_want.getDate()).slice(-2)+'-'+insurence_want.getFullYear();
  }

  console.log(total_data);
  //  total_data.personData[0].birthday = total_data.personData[0].birthday;
  const detailsEmailTemplate = swig.compileFile('advance_details_email.twig');
  console.log(detailsEmailTemplate);
  const html1 = detailsEmailTemplate(total_data);
  fs.writeFileSync('./detailsEmailTemplate123.html', html1);

  var subject1;
  if(total_data.personData.length){
    subject1 = total_data.agent['name'] + " **NQR* - " + address + " - "
    + (total_data.personData[0]['first_name'] + ' ' + total_data.personData[0]['last_name']);
  }else{
    subject1 = total_data.agent['name'] + " **NQR* - " + address;
  }

  let subject2 = "Quote Request Received! - " + address;
  let agentEmail, agentSubject, agentPhone, agentLink;


  if (typeof total_data.agent['email'] != undefined){
    agentEmail = total_data.agent['email'];
    agentPhone = total_data.agent['phone'];
    agentSubject = total_data.agent['name'];
    agentLink = total_data.agent['link'];
  } else {
    agentEmail = config.agentsInfo['pete']['email'];
    agentPhone = config.agentsInfo['pete']['phone'];
    agentSubject = config.agentsInfo['pete']['name'];
    agentLink = total_data.agent['link'];
  }

  total_data.agent['logo'] = "https://apply.insure/assets/images/agents/"+total_data.agent['logo'];

  Object.assign(total_data, {agentEmail});
  Object.assign(total_data, {agentPhone});
  Object.assign(total_data, {agentSubject});
  Object.assign(total_data, {agentLink});

  total_data.applicant_email_content = total_data.applicant_email_content.split("<br>").join("\n");
  const thankyouTemplate = swig.compileFile('thankyou.twig');
  const html2 = thankyouTemplate(total_data);

  let additional_email = total_data.agent['additional_email'].trim() != "" ? total_data.agent['additional_email'].replace("|",",") : "";

  if(total_data.personData.length){
    /*Send the "Thank you email" to user*/
    const msg2 = {
      from: config.from,
      to: [total_data.email],
      bcc:[agentEmail,additional_email],
      subject: subject2,
      html: html2
    };

    let thankyou = transporter.sendMail(msg2,function(err, info){
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
  }

  /*Send the "Quote Request email" to agent*/
  const msg4 = {
    from: config.from,
    to: config.peterEmail,
    subject: 'MASTER ' + subject1,
    html: html1
  };

  let mail1 = transporter.sendMail(msg4,function(err,info){
    if (err) {
      console.log(err)
    } else {
      console.log(info);
    }
  });

  /*Send the quote email*/
  let to = config.quote_mail;
  const msg1 = {
    from: config.from,
    to: [agentEmail],
    bcc:[to,additional_email],
    subject: subject1,
    html: html1
  };

  let mail2 = transporter.sendMail(msg1,function(err,info){
    if (err) {
      console.log(err)
    } else {
      console.log(info);
    }
  });

  // For google sheet entry.
  let foundation = total_data.discountsData.foundation;
  if(total_data.discountsData.foundation == "basement"){
    foundation += "  -"+total_data.discountsData.foundation;
  }

  let dog = total_data.discountsData.dog  == true ? "Yes" : "No";
  let dog_desc = total_data.discountsData.dog  == true ? "Yes" : "No";
  if(total_data.discountsData.dog == true){
    dog_desc = total_data.discountsData.dog_desc;
    dog += " - "+dog_desc;
  }

  let car_data = "";
  for(let i = 0;i < total_data.carData.length;i++){
    car_data += " ("+(i+1)+")  "+total_data.carData[i]['year']+"  "+total_data.carData[i]['type']+"  "+total_data.carData[i]['model']+"   \n";
  }

  let fifthPageCustomQuestion = "";
  if(total_data.pageFiveCustomQuestion.length > 0){
    for(let i = 0;i < total_data.pageFiveCustomQuestion.length;i++){
      fifthPageCustomQuestion += " ("+(i+1)+")  "+total_data.pageFiveCustomQuestion[i]['question']+":  "+total_data.pageFiveCustomQuestion[i]['answer']+"\n";
    }
  }

  let sixPageCustomQuestion = "";
  if(total_data.pageSixCustomQuestion.length > 0){
    for(let i = 0;i < total_data.pageSixCustomQuestion.length;i++){
      sixPageCustomQuestion += " ("+(i+1)+")  "+total_data.pageSixCustomQuestion[i]['question']+":  "+total_data.pageSixCustomQuestion[i]['answer']+"\n";
    }
  }

  var spreadsheet_id = "";
  if (typeof total_data.agent['spreadsheet_id'] != undefined){
    spreadsheet_id = total_data.agent['spreadsheet_id'];
  }

  var full_app_sheet_id = "";
  if (typeof total_data.agent['full_app_sheet_id'] != undefined){
    full_app_sheet_id = total_data.agent['full_app_sheet_id'];
    full_app_sheet_id = full_app_sheet_id.toString().trim();
  }

  let dateofbirth = new Date(persons[0]['birthday']);
  let birthday = ('0' + (dateofbirth.getMonth()+1)).slice(-2)+'-'+('0' + dateofbirth.getDate()).slice(-2)+'-'+dateofbirth.getFullYear();

  // check spreadsheet & short app sheet id availabel the zapier code execute.
  if(spreadsheet_id != "" && full_app_sheet_id != ""){
    // For google sheet / agency zoom entry.
    const qs = {
      "lead":{
        "applicant_name": persons[0]['first_name'] + ' ' + persons[0]['last_name'],
        "applicant_email":total_data.email,
        "applicant_phone":total_data.phone,
        "applicant_dob": birthday,
        "sheet":full_app_sheet_id,
        //"spreadsheet":"1ORbjmquf6Kpi1iTL4fhSwqRKkq8DOp6lTApWig51HTI",
        "spreadsheet":spreadsheet_id,
        "address":address,
        "city":city,
        "state":state,
        "postal_code":postal_code,
        "square_feet":total_data.sqft,
        "built_year":total_data.yearBuilt,
        "hometype":total_data.hometype,
        "primary_residence":foundation,
        "security_system":total_data.discountsData.security_system == true ? "Yes" : "No",
        "dog":dog,
        "dog_desc":dog_desc,
        "age_of_roof":total_data.discountsData.roof_shape,
        "roof_type":total_data.discountsData.roof_type,
        "short_term_rental":total_data.propertyData.term_rental == true ? "Yes" : "No",
        "property_own":total_data.propertyData.property_own == true ? "Yes" : "No",
        "multiple_unit":total_data.propertyData.multiple_unit == true ? "Yes" : "No",
        "insurance_claims":total_data.propertyData.insurance_claims == true ? "Yes" : "No",
        "policy_renewed":total_data.propertyData.policy_renewed == true ? "Yes" : "No",
        "swimming_pool":total_data.propertyData.swimming_pool == true ? "Yes" : "No",
        "car_data":car_data,
        "carrier_type":total_data.carrier_type,
        "insurence_want":total_data.insurence_want,
        "requestorcomments":total_data.requestorcomments,
        "fifth_page_custom_question":fifthPageCustomQuestion,
        "six_page_custom_question":sixPageCustomQuestion,
        "app_type":"full_app"
      }
    };

    const options = {
      //url:"https://hooks.zapier.com/hooks/catch/9334519/ox616re", // For Google sheet (mahavir acc)
      url:"https://hooks.zapier.com/hooks/catch/9240331/oxxhcut", // For Google sheet (peter acc)
      //url: "https://hooks.zapier.com/hooks/catch/9699027/onjw2j3", // For Zapier Demo
      //url:"https://hooks.zapier.com/hooks/catch/9240331/oxvf22f", // For Agency Zoom (peter acc)
      body:JSON.stringify(qs),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    var zapier_res = new Promise((resolve,reject) => {
      request(options, function(error, response, body){
        if (error) {
          console.log(error);
        } else {
          console.log(body);
        }
      });
    });
  }

  res.contentType('json');
  res.send(JSON.stringify({result: "success"}));
});

router.post('/send_life_upload_doc_email',
cors({
  origin: true,
  "Access-Control-Allow-Credentials": true,
  "Access-Control-Allow-Origin": true,
  "Access-Control-Allow-Headers": true,
  "Access-Control-Expose-Headers": true
}),
function (req, res, next) {
  const form = new formidable.IncomingForm({ multiples: true });
  form.parse(req, function (err, fields, files) {
    let total_data = JSON.parse(fields.data);
    const persons = total_data.personData;
    let address = "";
    if(total_data.manualAddress == ""){
      if(total_data.address){
        address = total_data.address.address + ", "
          + total_data.address.locality + ", " + total_data.address.administrative_area_level_1;
      }else{
      address = total_data.address.formatted_address;
      }
    }else{
      address = total_data.manualAddress;
    }
    Applicant.find({quote_id: total_data.quote_id}, function(err,applicant){
      if (err) {
        res.render('error');
        return;
      }
      if (applicant.length == 0) {
        let applicant = new Applicant();
        applicant.name = persons[0]['first_name'] + ' ' + persons[0]['last_name'];
        applicant.email = '';
        applicant.address = address;
        applicant.quote_id = total_data.quote_id;
        applicant.link = total_data.link;
        applicant.save();
      }
    });
    for(var  i = 0; i < total_data.personData.length; i++){
      var dob = new Date(total_data.personData[i].birthday);
      total_data.personData[i].birthday = ('0' + (dob.getMonth()+1)).slice(-2)+'-'+('0' + dob.getDate()).slice(-2)+'-'+dob.getFullYear();
    }

    if(total_data.insurence_want != "ASAP"){
      var insurence_want = new Date(total_data.insurence_want);
      total_data.insurence_want =  ('0' + (insurence_want.getMonth()+1)).slice(-2)+'-'+('0' + insurence_want.getDate()).slice(-2)+'-'+insurence_want.getFullYear();
    }

    const detailsEmailTemplate = swig.compileFile('details_email.twig');
    const html1 = detailsEmailTemplate(total_data);

    fs.writeFileSync('./detailsEmailTemplate123.html', html1);

    if(total_data.personData.length){
      subject1 = total_data.agent['name'] + " **NQR* - " + address + " - "
      + (total_data.personData[0]['first_name'] + ' ' + total_data.personData[0]['last_name']);
    }else{
      subject1 = total_data.agent['name'] + " **NQR* - " + address;
    }

    let subject2 = "Quote Request Received! - " + address;
    let agentEmail, agentSubject, agentPhone, agentLink;


    if (typeof total_data.agent['email'] != undefined){
      agentEmail = total_data.agent['email'];
      agentPhone = total_data.agent['phone'];
      agentSubject = total_data.agent['name'];
      agentLink = total_data.agent['link'];
    } else {
      agentEmail = config.agentsInfo['pete']['email'];
      agentPhone = config.agentsInfo['pete']['phone'];
      agentSubject = config.agentsInfo['pete']['name'];
    }
    total_data.agent['logo'] = "https://apply.insure/assets/images/agents/"+total_data.agent['logo'];

    Object.assign(total_data, {agentEmail});
    Object.assign(total_data, {agentPhone});
    Object.assign(total_data, {agentSubject});

    total_data.applicant_email_content = total_data.applicant_email_content.split("<br>").join("\n");
    const thankyouTemplate = swig.compileFile('thankyou.twig');
    const html2 = thankyouTemplate(total_data);

    let additional_email = total_data.agent['additional_email'].trim() != "" ? total_data.agent['additional_email'].replace("|",",") : "";

    //Send the "Thank you email" to user

    const msg2 = {
      from: config.from,
      to: [total_data.email],
      bcc:[agentEmail,additional_email],
      subject: subject2,
      html: html2,
    };
    let thankyou = transporter.sendMail(msg2,function(err, info){
      if (err) {
        console.log(err)
      } else {
        console.log(info);
      }
    });

    var attachament_arr = [];
    for(let i = 0; i < total_data.file_length; i++){
      attachament_arr.push({filename: files['uploadedDocument_'+i]['name'],path: files['uploadedDocument_'+i]['path']});
    }

    //Send the "Quote Request email" to agent
    const msg4 = {
      from: config.from,
      to: config.peterEmail,
      subject: 'MASTER ' + subject1,
      html: html1,
      attachments: attachament_arr
    };

    let mail1 = transporter.sendMail(msg4,function(err, info){
      if (err) {
        console.log(err)
      } else {
        console.log(info);
      }
    });

    //Send the quote email
    let to = config.quote_mail;
    const msg1 = {
      from: config.from,
      to: [agentEmail],
      bcc: [to,additional_email],
      subject: subject1,
      html: html1,
      attachments: attachament_arr
    };

    let mail2 = transporter.sendMail(msg1,function(err, info) {
      if (err) {
        console.log(err)
      } else {
        console.log(info);
      }
    })
  });
  res.contentType('json');
  res.send(JSON.stringify({result:"success"}));
});


router.post('/send_adavace_life_upload_doc_email',
cors({
  origin: true,
  "Access-Control-Allow-Credentials": true,
  "Access-Control-Allow-Origin": true,
  "Access-Control-Allow-Headers": true,
  "Access-Control-Expose-Headers": true
}),
function (req, res, next) {
  const form = new formidable.IncomingForm({multiples:true});
  form.parse(req, function (err, fields, files){
    let total_data = JSON.parse(fields.data);
    const persons = total_data.personData;
    let address = "";
    if(total_data.manualAddress == ""){
      if(total_data.address){
        address = total_data.address.address + ", "
        + total_data.address.locality + ", " + total_data.address.administrative_area_level_1;
      }else{
      address = total_data.address.formatted_address;
      }
    }else{
      address = total_data.manualAddress;
    }
    Applicant.find({quote_id: total_data.quote_id}, function (err, applicant) {
      if (err) {
        res.render('error');
        return;
      }

      if (applicant.length == 0 || total_data.personData.length) {
        let applicant = new Applicant();
        applicant.name = persons[0]['first_name'] + ' ' + persons[0]['last_name'];
        applicant.email = total_data.email;
        applicant.address = address;
        applicant.quote_id = total_data.quote_id;
        applicant.link = total_data.link;
        applicant.save();
      }
    });

    if(total_data.personData.length){
      for(var  i = 0; i < total_data.personData.length; i++){
        var dob = new Date(total_data.personData[i].birthday);
        total_data.personData[i].birthday = ('0' + (dob.getMonth()+1)).slice(-2)+'-'+('0' + dob.getDate()).slice(-2)+'-'+dob.getFullYear();
      }
    }


    if(total_data.insurence_want != "ASAP"){
      var insurence_want = new Date(total_data.insurence_want);
      total_data.insurence_want =  ('0' + (insurence_want.getMonth()+1)).slice(-2)+'-'+('0' + insurence_want.getDate()).slice(-2)+'-'+insurence_want.getFullYear();
    }

    //  total_data.personData[0].birthday = total_data.personData[0].birthday;
    const detailsEmailTemplate = swig.compileFile('advance_details_email.twig');

    const html1 = detailsEmailTemplate(total_data);
    fs.writeFileSync('./detailsEmailTemplate123.html', html1);

    var subject1; 
    if(total_data.personData.length){
      subject1 = total_data.agent['name'] + " **NQR* - " + address + " - "
      + (total_data.personData[0]['first_name'] + ' ' + total_data.personData[0]['last_name']);
    }else{
      subject1 = total_data.agent['name'] + " **NQR* - " + address;
    }

    let subject2 = "Quote Request Received! - " + address;
    let agentEmail, agentSubject, agentPhone, agentLink;


    if (typeof total_data.agent['email'] != undefined){
      agentEmail = total_data.agent['email'];
      agentPhone = total_data.agent['phone'];
      agentSubject = total_data.agent['name'];
      agentLink = total_data.agent['link'];
    } else {
      agentEmail = config.agentsInfo['pete']['email'];
      agentPhone = config.agentsInfo['pete']['phone'];
      agentSubject = config.agentsInfo['pete']['name'];
    }
    total_data.agent['logo'] = "https://apply.insure/assets/images/agents/"+total_data.agent['logo'];

    Object.assign(total_data, {agentEmail});
    Object.assign(total_data, {agentPhone});
    Object.assign(total_data, {agentSubject});

    total_data.applicant_email_content = total_data.applicant_email_content.split("<br>").join("\n");
    const thankyouTemplate = swig.compileFile('thankyou.twig');
    const html2 = thankyouTemplate(total_data);

    let additional_email = total_data.agent['additional_email'].trim() != "" ? total_data.agent['additional_email'].replace("|",",") : "";

    if(total_data.personData.length){
      /*Send the "Thank you email" to user*/
      const msg2 = {
        from: config.from,
        to: [total_data.email],
        bcc:[agentEmail,additional_email],
        subject: subject2,
        html: html2,
      };

      let thankyou = transporter.sendMail(msg2,function(err, info){
        if (err){
          console.log(err);
        } else {
          console.log(info);
        }
      });
    }

    var attachament_arr = []; 
    for(let i = 0; i < total_data.file_length; i++) {
      attachament_arr.push({filename: files['uploadedDocument_'+i]['name'],path: files['uploadedDocument_'+i]['path']});
    }
    /*Send the "Quote Request email" to agent*/
    const msg4 = {
      from: config.from,
      to: config.peterEmail,
      subject: 'MASTER ' + subject1,
      html: html1, 
      attachments: attachament_arr,
    };

    let mail1 = transporter.sendMail(msg4,function(err, info){
      if (err) {
        console.log(err)
      } else {
        console.log(info);
      }
    });

    /*Send the quote email*/
    let to = config.quote_mail;
    const msg1 = {
      from: config.from,
      to: [agentEmail],
      bcc:[to,additional_email],
      subject: subject1,
      html: html1,
      attachments: attachament_arr,
    };

    let mail2 = transporter.sendMail(msg1,function(err, info) {
      if (err) {
        console.log(err)
      } else {
        console.log(info);
      }
    });
  });
  res.contentType('json');
  res.send(JSON.stringify({result: "success"}));
});

router.post('/send_signup_request', function (req, res, next) {
  var userInfo = req.body.data;
  var urls = req.body.urls;
  var html = `<table>
                <caption>New signup request</caption>
                <tbody>
                  <tr>
                    <td colspan="2"><p>The following are information of new signup user.</p></td>
                  </tr>
                  <tr>
                    <th style="text-align:left;">Firstname: </th>
                    <td>`+userInfo.firstName+`</td>
                  </tr>
                  <tr>
                    <th style="text-align:left;">Lastname: </th>
                    <td>`+userInfo.lastName+`</td>
                  </tr>
                  <tr>
                    <th style="text-align:left;">Email: </th>
                    <td>`+userInfo.email+`</td>
                  </tr>
                  <tr>
                    <th style="text-align:left;">Phone: </th>
                    <td>`+userInfo.phone+`</td>
                  </tr>
                  <tr>
                    <th style="text-align:left;">BaseUrl: </th><td>`;
                  for(var i = 0; i < urls.length; i ++){
                    html += "http://apply.insure/"+urls[i]['basicurls']+`<br/>`;
                  }
                  html += `</td></tr>
                  <tr>
                    <th style="text-align:left;">No of links: </th>
                    <td>`+userInfo.links+`</td>
                  </tr>
                </tbody>
              </table>`;
  let to = 'peter@apply.insure';
  const msg1 = {
    from: config.from,
    to: [to],
    subject: "Apply Insure: Signup request",
    html: html
  };
  let mail2 = transporter.sendMail(msg1,function(err, info) {
    if (err) {
      console.log(err)
    } else {
      console.log(info);
    }
  });
  res.contentType('json');
  res.send(JSON.stringify({result: "success"}));
});

router.post('/send_life_form_email', function (req, res, next) {
  let total_data = req.body;
  const persons = total_data.personData;
  let address = "";
  let postal_code = city = state = "";
  if(total_data.manualAddress == ""){
    if(total_data.address){
      address = total_data.address.address + ", "
      + total_data.address.locality + ", " + total_data.address.administrative_area_level_1;

      postal_code = total_data.address.postal_code;
      city =  total_data.address.locality;
      state = total_data.address.administrative_area_level_1;
    }else{
     address = total_data.address.formatted_address;
    }
  }else{
    address = total_data.manualAddress;
  }
  Applicant.find({quote_id: total_data.quote_id}, function (err, applicant) {
    if (err) {
      res.render('error');
      return;
    }

    if (applicant.length == 0 || total_data.personData.length) {
      let applicant = new Applicant();
      applicant.name = persons[0]['first_name'] + ' ' + persons[0]['last_name'];
      applicant.email = total_data.email;
      applicant.address = address;
      applicant.save();
    }
  });

  if(total_data.personData.length){
    for(var  i = 0; i < total_data.personData.length; i++){
      var dob = new Date(total_data.personData[i].birthday);
      total_data.personData[i].birthday = ('0' + (dob.getMonth()+1)).slice(-2)+'-'+('0' + dob.getDate()).slice(-2)+'-'+dob.getFullYear();
    }
  }

  //  total_data.personData[0].birthday = total_data.personData[0].birthday;
  const detailsEmailTemplate = swig.compileFile('life_form_detail_email.twig');

  const html1 = detailsEmailTemplate(total_data);
  fs.writeFileSync('./detailsEmailTemplate123.html', html1);

  var subject1;
  if(total_data.personData.length){
    subject1 = total_data.agent['name'] + " **NQR* - " + address + " - "
    + (total_data.personData[0]['first_name'] + ' ' + total_data.personData[0]['last_name']);
  }else{
    subject1 = total_data.agent['name'] + " **NQR* - " + address;
  }

  let subject2 = "Quote Request Received! - " + address;
  let agentEmail, agentSubject, agentPhone,agentLink;


  if (typeof total_data.agent['email'] != undefined){
    agentEmail = total_data.agent['email'];
    agentPhone = total_data.agent['phone'];
    agentSubject = total_data.agent['name'];
    agentLink = total_data.agent['link'];
  } else {
    agentEmail = config.agentsInfo['pete']['email'];
    agentPhone = config.agentsInfo['pete']['phone'];
    agentSubject = config.agentsInfo['pete']['name'];
  }
  total_data.agent['logo'] = "https://apply.insure/assets/images/agents/"+total_data.agent['logo'];

  Object.assign(total_data, {agentEmail});
  Object.assign(total_data, {agentPhone});
  Object.assign(total_data, {agentSubject});
  Object.assign(total_data, {agentLink});

  total_data.applicant_email_content = total_data.applicant_email_content.split("<br>").join("\n");
  const thankyouTemplate = swig.compileFile('thankyou.twig');
  const html2 = thankyouTemplate(total_data);

  let additional_email = total_data.agent['additional_email'].trim() != "" ? total_data.agent['additional_email'].replace("|",",") : "";

  if(total_data.personData.length){
    /*Send the "Thank you email" to user*/
    const msg2 = {
      from: config.from,
      to: [total_data.email],
      bcc:[agentEmail,additional_email],
      subject: subject2,
      html: html2
    };

    let thankyou = transporter.sendMail(msg2,function(err, info){
      if (err){
        console.log(err);
      } else {
        console.log(info);
      }
    });
  }

  /*Send the "Quote Request email" to agent*/
  const msg4 = {
    from: config.from,
    to: [config.peterEmail],
    subject: 'MASTER ' + subject1,
    html: html1
  };

  let mail1 = transporter.sendMail(msg4,function(err,info) {
    if (err) {
      console.log(err)
    } else {
      console.log(info);
    }
  });

  /*Send the quote email*/
  let to = config.quote_mail;
  const msg1 = {
    from: config.from,
    to: [agentEmail],
    bcc:[to,additional_email],
    subject: subject1,
    html: html1
  };

  let mail2 = transporter.sendMail(msg1,function(err, info) {
    if (err) {
      console.log(err)
    } else {
      console.log(info);
    }
  });

  var spreadsheet_id = "";
  if (typeof total_data.agent['spreadsheet_id'] != undefined){
    spreadsheet_id = total_data.agent['spreadsheet_id'];
  }

  var life_app_sheet_id = "";
  if (typeof total_data.agent['life_app_sheet_id'] != undefined){
    life_app_sheet_id = total_data.agent['life_app_sheet_id'];
    life_app_sheet_id = life_app_sheet_id.toString().trim();
  }

  let dateofbirth = new Date(persons[0]['birthday']);
  let birthday = ('0' + (dateofbirth.getMonth()+1)).slice(-2)+'-'+('0' + dateofbirth.getDate()).slice(-2)+'-'+dateofbirth.getFullYear();

  // check spreadsheet & short app sheet id availabel the zapier code execute.
  if(spreadsheet_id != "" && life_app_sheet_id != ""){
    // For google sheet / agency zoom entry.
    const qs = {
      "lead":{
        "applicant_name": persons[0]['first_name'] + ' ' + persons[0]['last_name'],
        "applicant_email":total_data.email,
        "applicant_phone":total_data.phone,
        "applicant_dob": birthday,
        "sheet":life_app_sheet_id,
        //"spreadsheet":"1ORbjmquf6Kpi1iTL4fhSwqRKkq8DOp6lTApWig51HTI",
        "spreadsheet":spreadsheet_id,
        "address":address,
        "city":city,
        "state":state,
        "postal_code":postal_code,
        "square_feet":total_data.sqft,
        "built_year":total_data.yearBuilt,
        "requestorcomments":total_data.requestorcomments,
        "helththy":total_data.helththy
      }
    };
    const options = {
      //url:"https://hooks.zapier.com/hooks/catch/9334519/ox20ray", // For google-sheet (mahavir)
      url:"https://hooks.zapier.com/hooks/catch/9240331/oxx1sti", // For google-sheet (peter)
      //url:"https://hooks.zapier.com/hooks/catch/9699027/onjqbco", // For google-sheet zapier demo
      //url:"https://hooks.zapier.com/hooks/catch/9240331/oxvwroj",   // For agency-zoom  (peter)
      body:JSON.stringify(qs),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    var zapier_res = new Promise((resolve, reject) => {
      request(options, function (error, response, body) {
        if (error) {
          console.log(error);
        } else {
          console.log(body);
        }
      });
    });
  }
  res.contentType('json');
  res.send(JSON.stringify({result: "success"}));
});

router.post('/send_ethos_email', function (req, res, next) {
  let total_data = req.body;

  let address = "";
  if(total_data.manualAddress == ""){
    if(total_data.address){
      address = total_data.address.address + ", "
      + total_data.address.locality + ", " + total_data.address.administrative_area_level_1;
    }else{
     address = total_data.address.formatted_address;
    }
  }else{
    address = total_data.manualAddress;
  }

  const thankyouTemplate = swig.compileFile('ethos_api_success.twig');
  const html2 = thankyouTemplate(total_data);

   /*Send the quote email*/
   let to = config.quote_mail;
   const msg1 = {
     from: config.from,
     to: [total_data.agentEmail],
     subject: "Ethos api success mail **NQR* - " +address,
     html: html2
   };
   let mail2 = transporter.sendMail(msg1,function(err, info) {
    if (err) {
      console.log(err)
    } else {
      console.log(info);
    }
  });

  res.contentType('json');
  res.send(JSON.stringify({result: "success"}));
});

// Nationwide api code.
router.post("/get_nationwide",async function(req, res, next){
  try {
    var params = req.body

    var dob = new Date(params['personData'][0]['birthday']);
    dob = dob.getFullYear()+'-'+('0' + (dob.getMonth()+1)).slice(-2)+'-'+('0' + dob.getDate()).slice(-2);

    var data = {
      "policyHolders": [
        {
          "emailAddress": params['email'],
          "policyHolderType": "PolicyPriNamedInsured",
          "person": {
            "firstName": params['personData'][0]['first_name'],
            "middleName":"",
            "lastName": params['personData'][0]['last_name'],
            "dateOfBirth": dob,
            "gender": "M",
            "maritalStatus": "S"
          }
        }
      ],
      "policyAddress": {
        "addressLine1": params['address']['address'],
        "city": params['address']['locality'],
        "state": params['address']['administrative_area_level_1'],
        "postalCode": params['address']['postal_code']
      },
      "producer": {
        "producerCode": "00060164 - 002",
        "type": "Internet"
      },
      "creditConsent": true,
      "yearsWithPriorCarrier": "02",
      "coveredLocation": {
        "datePurchased": "2018-01-01"
      }
    };
    var header = {
      "Accept": "*/*",
      "Content-Type": "application/json",
      "client_id":config.nationwide.client_id,
      "Accept-Encoding": "gzip, deflate, br",
      "X-NW-Message-ID": "abc-123-87ab"
    };
    var options = {
      method: 'POST',
      uri: 'https://api-stage.nationwide.com/customer-acquisition/homeowners-sales-experience/v1/rated-quotes',
      headers: header,
      body: data,
      json: true // Automatically stringifies the body to JSON
    };
    console.log("Nationwide Option List:",options);
   request(options, function(error,response,body){
      if(error){
        res.send({
          result: "error",
          msg: "An error occurred while get nationwide price get",
        });
      }else{
        res.send({
          result: body,
          msg: "successfully received",
        });
      }
    });

  } catch (err) { console.log(err) }
});

router.post("/send_accurate_quote_mail",async function(req, res, next){
  try {
    var params = req.body;

    let address = "";
    if(params.subject.manualAddress == ""){
      if(params.subject.address){
        address = params.subject.address.address + ", "
        + params.subject.address.locality + ", " + params.subject.address.administrative_area_level_1;
      }else{
        address = params.subject.address.formatted_address;
      }
    }else{
      address = params.subject.manualAddress;
    }

    var subject;
    if(params.subject.personData.length){
      subject = params.subject.agentName + " **NQR* - " + address + " - "
      + (params.subject.personData[0]['first_name'] + ' ' + params.subject.personData[0]['last_name']);
    }else{
      subject = params.subject.agentName + " **NQR* - " + address;
    }

    var html = `<table>
                <caption style="text-align:left;"><h2 style="margin-bottom: 0px;">Have an extra minute ?</h2></caption>
                <tbody>
                  <tr>
                    <td colspan="2"><p>Details to help us get the
                    best and most accurate quote!</p></td>
                  </tr>`; 

                  for(var i = 0;i < params.eightPlusPerson; i++){
                    html += `<tr>
                      <th style="text-align:left;">DL Name  `+(i+1)+`: </th>
                      <td>`+params.AccurateQuoteFormData["DLName"+i]+`</td>
                    </tr>`;
                  }
                  
                  for(var i = 0;i < params.carDataLength; i++){
                    html += `<tr>
                      <th style="text-align:left;">CAR VIN `+(i+1)+`: </th>
                      <td>`+params.AccurateQuoteFormData["CARVIN"+i]+`</td>
                    </tr>`;
                  }
    html +=     `</tbody>
              </table>`;
    let to = 'peter@apply.insure';
    let agentEmail = params.subject.agentEmail;
    const msg1 = {
      from: config.from,
      to: [to,agentEmail],
      subject: subject,
      html: html
    };
    let mail2 = transporter.sendMail(msg1,function(err, info) {
      if (err) {
        console.log(err)
      } else {
        console.log(info);
      }
    });
    res.contentType('json');
    res.send(JSON.stringify({result: "success"}));
  } catch (err) { console.log(err) }
});

router.post("/send_line_of_business_mail",async function(req, res, next){
  try {
    var params = req.body;

    let address = "";
    if(params.subject.manualAddress == ""){
      if(params.subject.address){
        address = params.subject.address.address + ", "
        + params.subject.address.locality + ", " + params.subject.address.administrative_area_level_1;
      }else{
        address = params.subject.address.formatted_address;
      }
    }else{
      address = params.subject.manualAddress;
    }

    var subject;
    if(params.subject.personData.length){
      subject = params.subject.agentName + " **NQR* - " + address + " - "
      + (params.subject.personData[0]['first_name'] + ' ' + params.subject.personData[0]['last_name']);
    }else{
      subject = params.subject.agentName + " **NQR* - " + address;
    }

    var html = `<div>
                  <h2 style="margin-bottom: 5px;">Other lines of business:</h2>`
              for(var i = 0; i < params.OtherlineOfBusiness.length; i++){
                  html += `<b>`+(i+1)+`) `+ params.OtherlineOfBusiness[i] +`<b><br/><br/>`;          
              }
        html += `</div>`;
    let to = 'peter@apply.insure';
    let agentEmail = params.subject.agentEmail;
    const msg1 = {
      from: config.from,
      to: [agentEmail],
      subject: subject,
      html: html
    };
    let mail2 = transporter.sendMail(msg1,function(err, info) {
      if (err) {
        console.log(err)
      } else {
        console.log(info);
      }
    });
    res.contentType('json');
    res.send(JSON.stringify({result: "success"}));
  } catch (err) { console.log(err) }
});

router.post("/zapier/save-user-detail",function(req, res, next){
	try {
		var query = req.body;
		res.contentType('json');
		res.send(JSON.stringify({status:200,result: query}));
	} catch (err) { console.log(err) }
});

router.post("/zapier/agent-login",function(req, res, next){
  try {
		var query = req.body;
		var username = query.username;
		var password = query.password;
		con.query("SELECT * FROM agents WHERE username = '"+username+"' and password = '"+password+"' ", function (err, result, fields) {
			if(err) throw err;
			console.log(result);
			res.contentType('json');
			if(result.length){
				res.send(JSON.stringify({result: "success",data:result[0]}));
			}else{
			   res.send(JSON.stringify({result: "error",message:"404: No data found."}));
			}
		});
		
  } catch (err) { console.log(err) }
});

router.post('/send_userdata_to_agent',
  cors({
    origin: true,
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Origin": true,
    "Access-Control-Allow-Headers": true,
    "Access-Control-Expose-Headers": true
  }),
  function (req, res, next) {

    const form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      let dir = '../personData';
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      let oldpath = files.attachment.path;
      let newpath = path.dirname(__filename).replace(/\\/g, '/').replace(path.dirname(__filename).split(path.sep).pop(), 'personData') + '/' + Date.now() + '_' + files.attachment.name;
      mv(oldpath, newpath, {mkdirp: true}, function (err) {
        if (err) {
          res.send({status: 'error'});
        } else {
          let filedata = base64_encode(newpath);
          let htmlbody = "<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">\n" +
            "                    <tr mc:repeatable=\"item\">\n" +
            "                      <td style=\"padding:0 0 27px;\">\n" +
            "                        <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">\n" +
            "                          <tr>\n" +
            "                            <td mc:edit=\"block_26\" width=\"40\" valign=\"top\">\n" +
            "                              <img src=\"https://www.psd2html.com/examples/markup/ultimaker/ico-01.png\" width=\"32\"\n" +
            "                                   style=\"vertical-align:top;\" alt=\"\"/>\n" +
            "                            </td>\n" +
            "                            <td mc:edit=\"block_27\" valign=\"top\"\n" +
            "                                style=\"font:14px/24px Verdana, Geneva, sans-serif; color:#3b434a;\">\n" +
            "                              <b>Name:</b> " + fields['username'] + "\n" +
            "                            </td>\n" +
            "                          </tr>\n" +
            "                        </table>\n" +
            "                      </td>\n" +
            "                    </tr>\n" +
            "                    <tr mc:repeatable=\"item\">\n" +
            "                      <td style=\"padding:0 0 27px;\">\n" +
            "                        <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">\n" +
            "                          <tr>\n" +
            "                            <td mc:edit=\"block_26\" width=\"40\" valign=\"top\">\n" +
            "                              <img src=\"https://www.psd2html.com/examples/markup/ultimaker/ico-01.png\" width=\"32\"\n" +
            "                                   style=\"vertical-align:top;\" alt=\"\"/>\n" +
            "                            </td>\n" +
            "                            <td mc:edit=\"block_27\" valign=\"top\"\n" +
            "                                style=\"font:14px/24px Verdana, Geneva, sans-serif; color:#3b434a;\">\n" +
            "                              <b>Comment:</b> " + fields['comment'] + "\n" +
            "                            </td>\n" +
            "                          </tr>\n" +
            "                        </table>\n" +
            "                      </td>\n" +
            "                    </tr>\n" +
            "                  </table>\n";
          let htmlContent = commonHelper.getEmailCommonPart()['header'] + htmlbody + commonHelper.getEmailCommonPart()['footer'];
          fs.readFile(newpath, function (err, data) {
            sgMail.send({
              to: 'peter.hughes@pinnaclepartnerscorp.com',
              from: 'info@pinnaclepartnerscorp.com',
              subject: 'Job Inquiry from Website :' + fields['jobTitle'],
              attachments: [{
                filename: files.attachment.name,
                content: filedata,
                type: 'application/pdf',
                disposition: 'attachment',
                contentId: 'myId'
              }],
              html: htmlContent
            });
          });

          function base64_encode(file) {
            let source = fs.readFileSync(file);
            return new Buffer.from(source).toString('base64');
          }

          res.send({status: 'success'});
        }
        res.end();
      });
    })
  });

// function that calls property details api accepting the property id and returns the required  object
async function getPropertyInfo(propertyId) {
  return new Promise(resolve => {
    if (propertyId) {

      var req = unirest("GET", config.RealtorConfig.endpoint.property_details);

      req.query({
        "property_id": propertyId
      });
      req.header =
        req.headers(setRapidApiHeader());

      req.end(async function (res) {
        if (res.error) {
          console.log("error");
          resolve(null);
        }
        console.log("success");
        if (res.body && res.body.properties && res.body.properties.length > 0) {
          const resp = {
            year_built: res.body.properties[0].year_built || res.body.properties[0].public_records[0].year_built,
            price: res.body.properties[0].price,
            building_size: res.body.properties[0].building_size.size || res.body.properties[0].public_records[0].building_sqft
          };
          resolve(resp);
        }
      })
    }
    else {
      resolve(null);
    }
  });
}

function setRapidApiHeader(){

  return {
    "x-rapidapi-host": config.RealtorConfig.settings.host,
    "x-rapidapi-key": config.RealtorConfig.settings.key,
    "useQueryString": true
  };
}

module.exports = router;

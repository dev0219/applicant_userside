

const fs = require('fs');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');
const https = require('https');
const http = require('http');
const config = require('./config');
const configdatabase = require('./config/database');
const apiRouter = require('./routes/index');
const passport = require('passport');
const multer = require('multer');
require('./config/passport');
require('./models/User');
const bodyParser = require('body-parser')
// mongoose.connect(config.db_dev);
// mongoose.Promise = global.Promise;
const app = express();
let UserController=require('./controllers/usercontroller');
if (config.isServer) {
  console.log('isServer ' + config.isServer);

  const hostname = config.hostname;
  const httpPort = 80;
  const httpsPort = 443;
  const httpSOptions = {
    cert: fs.readFileSync(config.certificateInfo['cert'], 'utf8'),
    key: fs.readFileSync(config.certificateInfo['key'], 'utf8')
  };
  const httpsServer = https.createServer(httpSOptions, app);
  const httpServer = http.createServer(app);
  app.use(function (req, res, next) {
    if (req.protocol === 'http') {
      res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
    next();
  });
  httpServer.listen(httpPort);
  httpsServer.listen(httpsPort);
}
app.use(express.static('upload'))
mongoose.Promise = global.Promise;
mongoose.connect(configdatabase.database);
let db = mongoose.connection;
db.once('open', function(){
  console.log('Connected to MongoDB');
});
db.on('error', function(err){
    console.log(err);
  });
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
const server = app.listen(3000, function () {
  console.log('Server listening at http://' + server.address().address + ':' + server.address().port);

});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/dashboard', express.static(path.join(__dirname, 'admin')));
app.use('/dashboard/login', express.static(path.join(__dirname, 'admin')));
app.use('/dashboard/forgotpassword', express.static(path.join(__dirname, 'admin')));
app.use('/dashboard/password-reset/:token', express.static(path.join(__dirname, 'admin')));
app.use(express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/index', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/login', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/landing', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/statistics', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/register', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/password', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/profile', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/settings', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/agents', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/group', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/pricing', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/links', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/guard', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
// app.use('/pete', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/safeguard', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/jon', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/gaby', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/dan', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/blayre', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/carnegie', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/jeff', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/tj', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/trey', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/gola', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/fox', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/mike', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/tc', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/jason', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/bill', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/zo', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/manfra', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/TJ2', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/DGP', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/DGC', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
// app.use('/LD', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/neilc', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/wilt', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/premier', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/ironvalley', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/ivy', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/power', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/lancaster', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/ocean', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/strive', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/edge', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/crescent', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/golden', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/northeast', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/treasure', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/oldetown', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/jordan', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/tommy', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/jpin', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/neil', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/premierpete', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/joe', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/brian', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/ringer', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/jennifer', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
/*Oct 25th*/
app.use('/eileen', express.static(path.join(__dirname, 'dist/mdb-angular-free')));

/*  Admin and User Dashboard Apis */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './upload');
  },
  filename: (req, file, cb) => {
    var newname = file.originalname;
    newname = newname.replace(/[&\/\\#,+()$~%'":*?<>{}]/g, '').toLowerCase()
    newname = newname.replace(/\s+/g, '').toLowerCase();
    cb(null, `${newname}`);
  }
});

const upload = multer({storage});
app.use('/fileupload', upload.single('file'), (req, res) => {
  console.log(req.file.path);
  res.send('file uploaded');
});
app
  .use('/dashboardlogin', UserController.login_post)
  .use('/create', UserController.store)
  .use('/sendemail', UserController.forgotpasswordemail)
  .use('/resetpassword', UserController.resetpassword)
  .use('/all', UserController.all)
  
  .use('/alldelete',UserController.alldelete)
  .use('/delete', UserController.delete)
  .use('/status', UserController.statusupdate)
  .use('/getuser', UserController.getuser)
  .use('/edit', UserController.userupdate)
  .use('/getuserid', UserController.getuserid)
  .use('/statusupdate', UserController.statusupdate)
  .use('/allapplicant', UserController.allapplicant)

  
/*  Admin and User Dashboard Apis */



app.use('/caitlin', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/nc', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
/*Oct 25th*/
/*June 30th*/
app.use('/patriot', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
/*June 30th*/
app.use('/', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/api', apiRouter);
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message": err.name + ": " + err.message});
  }
});
app.use('/about', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/sales-teams', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/campaigns', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/:agent', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/f/:agent', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/life/:agent', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
// make '/app' default route
// app.get('/', function (req, res) {
//   return res.redirect('/home');
// });
// error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.status);
});
module.exports = app;

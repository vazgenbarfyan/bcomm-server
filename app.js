const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const serverConfig = process.env.APP_CONFIG ? JSON.parse(process.env.APP_CONFIG) : null;
const mongoPassword = '123456';
const mongoURL = serverConfig ? "mongodb://" + serverConfig.mongo.user + ":" + mongoPassword + "@" +
  serverConfig.mongo.hostString : 'mongodb://localhost:27017/bcom';

mongoose.connect(mongoURL);
mongoose.Promise = global.Promise;

const app = express();

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Expose-Headers', 'Content-Length');
  res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
  if (req.method === 'OPTIONS') {
    return res.send(200);
  } else {
    return next();
  }
});

const Authorize = require('./services/Auth');

const index = require('./routes/index');
const auth = require('./routes/auth');
const users = require('./routes/users');
const posts = require('./routes/posts');
const admin = require('./routes/admin');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  req.db = mongoose;
  next();
});


app.use('/', index);
app.use('/auth', auth);
app.use('/users', Authorize, users);
app.use('/posts', Authorize, posts);
app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).end();
});


module.exports = app;

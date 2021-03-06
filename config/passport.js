const localStrategy = require('passport-local').Strategy;
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;

const User = require('../models/User');
const configAuth = require('./auth');

module.exports = function (passport) {

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });


  passport.use('local-signup', new localStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    function (req, email, password, done) {
      process.nextTick(function () {
        User.findOne({'local.username': email}, function (err, user) {
          if (err)
            return done(err);
          if (user) {
            return done(null, false, req.flash('signupMessage', 'That email already taken'));
          } else {
            const newUser = new User();
            newUser.local.username = email;
            newUser.local.password = newUser.generateHash(password);

            newUser.save(function (err) {
              if (err)
                throw err;
              return done(null, newUser);
            })
          }
        })

      });
    }));


  passport.use('local-login', new localStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    function (req, email, password, done) {
      process.nextTick(function () {
        User.findOne({'local.username': email}, function (err, user) {
          if (err)
            return done(err);
          if (!user)
            return done(null, false, req.flash('loginMessage', 'No User found'));
          if (!user.validPassword(password)) {
            return done(null, false, req.flash('loginMessage', 'invalid password'));
          }
          return done(null, user);

        });
      });
    }
  ));


  passport.use(new googleStrategy({
      clientID: configAuth.googleAuth.clientID,
      clientSecret: configAuth.googleAuth.clientSecret,
      callbackURL: configAuth.googleAuth.callbackURl
    },
    function (accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        User.findOne({"google.id": profile.id}, function (err, user) {
          if (err)
            return done(err);
          if (user)
            return done(null, user);
          else {
            const newUser = new User();
            newUser.google = {
              id: profile.id,
              token: accessToken,
              name: profile.displayName,
              email: profile.emails[0].value
            };

            newUser.save(function (err) {
              if (err)
                throw err;
              return done(null, newUser);
            });
          }

        })

      });
    }
  ));
};
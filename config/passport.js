// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

// load up the user model
var User            = require('../app/models/user');
var Permit      = require('../app/models/permission.js');

//load the auth variables
var configAuth = require('./auth');

// expose this function to our app using module.exports
module.exports = function(passport) {

  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });


  // =========================================================================
  // TWITTER =================================================================
  // =========================================================================
  passport.use(new TwitterStrategy({

    consumerKey     : configAuth.twitterAuth.consumerKey,
    consumerSecret  : configAuth.twitterAuth.consumerSecret,
    callbackURL     : configAuth.twitterAuth.callbackURL

  },
  function(token, tokenSecret, profile, done) {

    // make the code asynchronous
    // User.findOne won't fire until we have all our data back from Twitter
    process.nextTick(function() {

      User.findOne({ 'twitter.id' : profile.id }, function(err, user) {

        // if there is an error, stop everything and return that
        // ie an error connecting to the database
        if (err)
          return done(err);

        // if the user is found then log them in
        if (user) {
          return done(null, user); // user found, return that user
        } else {
          // if there is no user, create them
          var newUser                 = new User();

          // set all of the user data that we need
          newUser.twitter.id          = profile.id;
          newUser.twitter.token       = token;
          newUser.twitter.token_secret = tokenSecret;
          newUser.twitter.username    = profile.username.toLowerCase();
          newUser.twitter.displayName = profile.displayName;

          // save our user into the database
          newUser.save(function(err) {
            if (err){
              throw err;
            }
          // add new person to permission so they can tweet as themself    
          var newPermit            = new Permit();
          newPermit.twitteruser.ownerusername = profile.username.toLowerCase();
          newPermit.twitteruser.contributorusername = profile.username.toLowerCase();
          newPermit.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
            }); 
          });
        }
      });
    });
  }));
};

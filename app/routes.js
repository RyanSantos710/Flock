require('console-stamp')(console, '[HH:MM:ss.l]');

var Q = require("q");

// app/routes.js
module.exports = function(app, passport) {
  var permissionCheck = require('./models/permission.js');
  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  app.get('/', function(req, res) {
    res.render('index.ejs'); // load the index.ejs file
  });

  // =====================================
  // LOADING AUTH/CONTRIB LIST ===========
  // =====================================
  function fetchAccounts(username, mongoKey) {
    var deferred = Q.defer();
    var conditions = {};
    conditions['twitteruser.' + mongoKey] = username;
    permissionCheck.find(conditions, function (err, list){
      if (err) {
        deferred.reject(err);
      }
      deferred.resolve(list);
    });
    return deferred.promise;
  }

  function fetchAuthorizedAccounts(username) {
    return fetchAccounts(username, 'contributorusername');
  }

  function fetchContributorAccounts(username) {
    return fetchAccounts(username, 'ownerusername');
  }

  // =====================================
  // PROFILE SECTION =====================
  // =====================================
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  app.get('/profile', isLoggedIn, function(req, res) {
    var user = req.user;

    //Adding the two list to the profile page
    Q.all([fetchAuthorizedAccounts(user.twitter.username), fetchContributorAccounts(user.twitter.username)]).then( function(lists) {
      res.render('profile.ejs', {
        user : req.user,
        authorizedaccounts: lists[0],
        contributoraccounts: lists[1]
      });
    }).fail(function() {
      console.log("Promise FAIL");
    });;

  });

  // =====================================
  // PROFILE-TWEET SECTION ===============
  // =====================================

  // =====================================
  // ADD CONTRIBUTOR =====================
  // =====================================
  app.post('/add', function(req, res) {
    var user = req.user;
    var permissionModel = require('./models/permission.js');
    var contributor = req.body.contributor;
    var newPermission = new permissionModel();
    newPermission.twitteruser.ownerusername = user.twitter.username;
    newPermission.twitteruser.contributorusername = contributor;
    newPermission.save(function (err){
      if (err){
        console.log("ERROR!");
      }
    });
    res.redirect('/profile')
  });

  // =====================================
  // TWEET FUNCTION ======================
  // =====================================
  app.post('/tweet', function(req, res) {
    var tweet = req.body.tweet;
    var tweet_as_username = req.body.tweet_as_username//.toLowerCase();
    var configAuth = require('../config/auth');
    var user = req.user;
    var Twit = require('twit')
    var userModel = require('./models/user.js');
    var dialog = require('dialog');

    // =====================================
    // CONTRIBUTOR CHECK ===================
    // =====================================
    permissionCheck.findOne({
      'twitteruser.contributorusername':   user.twitter.username.toLowerCase(),
      'twitteruser.ownerusername': tweet_as_username
    }, function (err, permission){
      if (err){
        dialog.info('ERROR! PERMISSION DENIED!');
        console.log("ERROR! PERMISSION DENIED!");
        res.redirect('/profile');
      } else if (permission == null){
        dialog.info('ERROR! PERMISSION DENIED!');
        console.log("ERROR! PERMISSION DENIED!");
        res.redirect('/profile');
      } else {
        dialog.info('Tweet successful!');
        console.log("You have permission!");

        // =====================================
        // TWEET OUT ===========================
        // =====================================

        // THIS GRABS INFORMATION FROM MONGO AND THEN IT TAKES THE  ACCESS KEYS/SECRETS AND ASSINGS THEM TO THE TWEET
        userModel.findOne({ 'twitter.username': tweet_as_username }, function (err, user){
          if (err){
            console.log("ERROR!");
          } else {
            var T = new Twit({
              consumer_key:          configAuth.twitterAuth.consumerKey
              ,  consumer_secret:    configAuth.twitterAuth.consumerSecret
              , access_token:        user.twitter.token
              , access_token_secret: user.twitter.token_secret
            })

            console.log(tweet);
            T.post('statuses/update', { status: tweet }, function(err, data, response) {
            })
            res.redirect('/profile')
          }
        });
      }
    });

  });

  // =====================================
  // LOGOUT ==============================
  // =====================================
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // =====================================
  // TWITTER ROUTES ======================
  // =====================================
  // route for twitter authentication and login
  app.get('/auth/twitter', passport.authenticate('twitter'));

  // handle the callback after twitter has authenticated the user
  app.get('/auth/twitter/callback',
          passport.authenticate('twitter', {
            successRedirect : '/profile',
            failureRedirect : '/'
          }));

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}

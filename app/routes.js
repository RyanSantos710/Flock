// app/routes.js
module.exports = function(app, passport) {

  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  app.get('/', function(req, res) {
    res.render('index.ejs'); // load the index.ejs file
  });

  // =====================================
  // LOGIN ===============================
  // =====================================
  // show the login form
  app.get('/login', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('login.ejs', { message: req.flash('loginMessage') }); 
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));


  // =====================================
  // SIGNUP ==============================
  // =====================================
  // show the signup form
  app.get('/signup', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  // =====================================
  // PROFILE SECTION =====================
  // =====================================
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
      user : req.user // get the user out of session and pass to template
    });
  });

  // =====================================
  // PROFILE-TWEET SECTION ===============
  // =====================================    
  app.post('/', function(req, res) {
    var tweet = req.body.username;
    var configAuth = require('../config/auth');
    var user = req.user;
    var Twit = require('twit')

    var T = new Twit({
    consumer_key:         configAuth.twitterAuth.consumerKey 
  , consumer_secret:      configAuth.twitterAuth.consumerSecret  
  , access_token:         user.twitter.token
  , access_token_secret:  user.twitter.token_secret
    })
    
    console.log(T);
    /* TO PREVENT SPAM WHILE TESTING
    T.post('statuses/update', { status: tweet }, function(err, data, response) {
    })
    */
    res.redirect('/profile');
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
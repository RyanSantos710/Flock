// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

  twitter          : {
    id           : String,
    token        : String,
    token_secret : String,
    displayName  : String,
    username     : String
  }
});

// methods ======================
// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);


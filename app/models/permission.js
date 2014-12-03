// app/models/permission.js
var mongoose = require('mongoose');

// define the schema for our user model
var permissionSchema = mongoose.Schema({

  twitteruser               : {
    ownerusername           : String,
    contributorusername     : String,
  }
});

// methods ======================
// create the model for users and expose it to our app
module.exports = mongoose.model('Permission', permissionSchema);
var mongoose = require('mongoose');

var User = mongoose.model('Users', {
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  age: {
    type: Number,
    required: false,
    default: null,
    min: 1
  },
  location: {
    type: String,
    default: null,
    required: false,
    minlength: 1
  }
});


module.exports = {User};

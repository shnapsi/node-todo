var mongoose = require('mongoose');
var {ObjectID} = require('mongodb');

mongoose.Promise = global.Promise; //tells mongoose that we want to use global promise
mongoose.connect(process.env.MONGODB_URI);

module.exports = {mongoose, ObjectID};

var mongoose = require('mongoose');

mongoose.Promise = global.Promise; //tells mongoose that we want to use global promise
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {mongoose};

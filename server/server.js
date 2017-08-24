var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var {mogoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');



var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
      text: req.body.text
    });
    todo.save().then((doc) => {
      res.send(doc);
    }, (err) => {
      res.status(400).send(err);
    });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos})
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;
  if(ObjectID.isValid(id)) {
      Todo.findById(id).then((todo) => {
          if(!todo) {
            return res.send(404).send();
          }
          res.send({todo});
      }).catch((e) => {
        res.status(400).send();
      });
  } else {
    return res.send(404).send();
  }
});

app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports = {app};
// var newTodo = new Todo({
//   text: 'Cook dinner'
// });
//
// newTodo.save().then((doc) => {
//   console.log('Saved todo ', doc);
// }, (e) => {
//   console.log('Unable to save todo');
// });

// var newTodo2 = new Todo({
//   text: 'Cook dinner',
//   completed: true,
//   completedAt: 100505
// });
//
// newTodo2.save().then((doc) => {
//   console.log('Saved todo ', doc);
// }, (e) => {
//   console.log('Unable to save todo');
// });
//
// var newUser = new User({
//   name: 'Tomer',
//   email: 'tomer@b.com'
// });
//
// newUser.save().then((user) => {
//   console.log('User added', user);
// }, (e) => {
//   console.log('Failed to add user', e);
// });

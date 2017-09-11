const request = require('supertest');
const expect = require ('expect');


const {app} = require('./../server');
const {Todo} = require ('./../models/todo');
const {User} = require ('./../models/user');
const {todos, populateTodos, users, populateUsers} = require ('./seed/seed');

const {ObjectID} = require('mongodb');


beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST/todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create todo with invalid body data', (done) => {
      request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          console.log('Todo is invalid and wasn\'t created');
          done();
        }).catch((e) => done(e));
      });
  });

  describe('GET /todos', () => {
    it('should get all todos', (done) => {
      request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
          expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    });
  });
});

describe('Get / todos :id', () => {

  it('should get a todo by id', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    var _id = new ObjectID();
    request(app)
    .get(`/todos/${_id}.toHexString()}`)
    .expect(404)

    .end(done);
  });

  it('should return 404 if id is invalid', (done) => {
    var _id = 'aaaaa';
    request(app)
    .get(`/todos/${_id}.toHexString()}`)
    .expect(404)

    .end(done);
  });

});

describe('Delete /todos :id', () => {
    it('should remove a todo by id', (done) => {

      var hexId = todos[0]._id.toHexString();

      request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        Todo.findById(hexId).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((e) => done(e));
      });
    })

    it('should return 404 if todo not found', (done) => {
      var _id = new ObjectID();
      request(app)
      .delete(`/todos/${_id}.toHexString()}`)
      .expect(404)

      .end(done);
    });

    it('should return 404 if id is invalid', (done) => {
      var _id = 'aaaaa';
      request(app)
      .delete(`/todos/${_id}.toHexString()}`)
      .expect(404)

      .end(done);
    });

  });

  describe('Update /todos :id', () => {
      it('should update a todo by id', (done) => {
        var hexId = todos[0]._id.toHexString();
        request(app)
        .patch(`/todos/${hexId}`)
        .send({
          "text": "Updated from test",
          "completed": true,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe('Updated from test')
          expect(res.body.todo.completedAt).toBeA('number')

        }).end(done);
      });

      it('should clear completedAt when todo is not completed', (done) => {
        var hexId = todos[1]._id.toHexString();
        request(app)
        .patch(`/todos/${hexId}`)
        .send({
          "completed": false
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.completed).toBe(false);
          expect(res.body.todo.completedAt).toNotExist();
        })
        .end(done);
      });
    });

    describe('Get /users/me', ()=> {
      it('should return user if authenticated', (done) => {
        request(app)
          .get('/users/me')
          .set('x-auth', users[0].tokens[0].token)
          .expect(200)
          .expect((res) => {
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
          })
          .end(done);
      });

      it('should return 401 if not authenticated', (done) => {
        request(app)
          .get('/users/me')
      //    .set('x-auth', 'aaaaa')
          .expect(401)
          .expect((res) => {
            expect(res.body).toEqual({});
        })
          .end(done);
      });
    });

    describe('Post /users', () => {
      it('should create a user', (done) => {
        var email = 'example@example.com'
        var password = '123mnb!'

        request(app)
          .post('/users')
          .send({email, password})
          .expect(200)
          .expect((res) => {
            expect(res.headers['x-auth']).toExist();
            expect(res.body._id).toExist();
            expect(res.body.email).toBe(email);
          })
          .end((err) => {
            if(err) {
              return done(err);
            }
            User.findOne({email}).then((user) => {
              expect(user).toExist();
              expect(user.password).toNotBe(password);
              done();
            }).catch((e) => done(e));
          });
      });

      it('should return validation errors if request invalid', (done) => {
        var email = 'exampleexample.com'
        var password = '1'

        request(app)
          .post('/users')
          .send({email, password})
          .expect(400)
          // .expect((res) => {
          //   expect(res.headers['x-auth']).toNotExist();
          //   expect(res.body).toBe({});
          // })
          .end(done) ;
      });

      it('should not create a user if email in use', (done)=> {
        var email = users[0].email;
        var password = '123mnb!'

        request(app)
          .post('/users')
          .send({email, password})
          .expect(400)
          .expect((res) => {
            expect(res.headers['x-auth']).toNotExist();
            expect(res.body._id).toNotExist();
          })
          .end(done);
      });
    });

    describe('POST /users/login', () => {
      it('should login user and return auth token', (done) => {
        request(app)
          .post('/users/login')
          .send({
            email: users[1].email,
            password: users[1].password
          })
          .expect(200)
          .expect((res) => {
            expect(res.headers['x-auth']).toExist();
          })
          .end((err, res) => {
            if(err) {
              return done(err);
            }
            User.findById(users[1]._id).then((user) => {
              expect(user.tokens[0]).toInclude( {
                access: 'auth',
                token: res.headers['x-auth']
              });
                done();
            }).catch((e) => done(e));
          });

      });

      it('should reject invalid login', (done) => {
        request(app)
          .post('/users/login')
          .send({
            email: users[1].email,
            password: users[1].password + 'add'
          })
          .expect(400)
          .expect((res) => {
            expect(res.headers['x-auth']).toNotExist();
            expect(res.body._id).toNotExist();
          })
          .end(done);
      });
    });

    describe('DELETE /users/me/token', ()=> {
      it('should remove user token if valid', (done) => {
        console.log('token:' , users[0].tokens[0].token);
          request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
              expect(res.headers['x-auth']).toNotExist();
            })
            .end((err, res) => {
              if(err) {
                return done(err);
              }
              User.findById(users[0]._id).then((user) => {
                if(!user) {
                  console.log('Couldn\'t find user with id ', users[0]._id);
                  done();
                }
                expect(user.tokens.length).toBe(0);
                  done();
              }).catch((e) => done(e));
            });
      });

      it('should not remove user token if user is not valid', (done) => {
        request(app)
          .delete('/users/me/token')
          .set('x-auth', users[0].tokens[0].token + 'aa')
          .expect(401)
          .end(done);
      });
    });

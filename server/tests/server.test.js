const request = require('supertest');
const expect = require ('expect');


const {app} = require('./../server');
const {Todo} = require ('./../models/todo');

const {ObjectID} = require('mongodb');

const todos = [
  {
    _id: new ObjectID(),
    text: 'first test todo',
    completed: false,
    completedAt: null
  },  {
    _id: new ObjectID(),
    text: 'second test todo',
    completed: true,
    completedAt: 444
}
];
beforeEach((done) => {
    Todo.remove({}).then(() => {
      return Todo.insertMany(todos);
    }).then(() => done());
});

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

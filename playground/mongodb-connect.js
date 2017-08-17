const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db)=> {
  if(error) {
    return console.log('Unable to connect to mongo db server');
  }
  console.log('Connected to MongoDb server');

  // db.collection('Todos').insertOne({
  //     text: 'Something to do',
  //     completed: false
  // }, (err, result) => {
  //   if(err) {
  //     return console.log('Unable to inset Todo', err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });


    db.collection('Users').insertOne({
      name: 'Gidi',
      age: 38,
      location: 'Tel Aviv'
    }, (err, result)=> {
      if(err) {
          return console.log('Unable to add user', err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
    });


  db.close();
});

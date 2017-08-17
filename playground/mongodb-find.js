const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db)=> {
  if(error) {
    return console.log('Unable to connect to mongo db server');
  }
  console.log('Connected to MongoDb server');

  // db.collection('Todos').find({completed: false}).toArray().then((docs) => {
  //     console.log('Todos:');
  //     console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('Unable to fetch todos', err);
  // });

  db.collection('Users').find({location: 'Holon'}).count().then((count) => {
    console.log(`Users from Holon: ${count}`);
  }, (err) => {
    console.log('Error occured while trying to fetch users ', err);
  });
  //db.close();
});

const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db)=> {
  if(error) {
    return console.log('Unable to connect to mongo db server');
  }
  console.log('Connected to MongoDb server');

  // db.collection('Todos').deleteMany({text: 'Delete Todo'}).then((result) => {
  //   console.log(result);
  // });

  // db.collection('Todos').deleteOne({text: 'Delete Todo'}).then((result) => {
  //   console.log(result);
  // });

  db.collection('Todos').findOneAndDelete({completed: true}).then((result) => {
    console.log(result);
  });

  //db.close();
});

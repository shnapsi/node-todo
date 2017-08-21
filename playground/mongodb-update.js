const {MongoClient, ObjectID} = require('mongodb');

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

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5999729c1ba72afbcf695c6a')
  }, {
    $set: {
      name: 'Haim'
    },
    $inc: {
      age: 1
    }
  }, {
      returnOriginal : false
    }).then((result) => {
      console.log(result);
  });

  //db.close();
});

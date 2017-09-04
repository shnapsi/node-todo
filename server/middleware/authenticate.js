var {User} = require ('./../models/user');

var authenticate = (req, res, next) => {
  var token = req.header('x-auth');
  console.log(`Token: ${token}`);
  User.findByToken(token).then((user) => {
    if(!user) {
        console.log('Failed to find user');
        return Promise.reject();
    }

    req. user = user;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(401).send();
  });
};

module.exports = {authenticate};

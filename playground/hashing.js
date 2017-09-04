const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const util = require('util');

const bcrypt = require('bcryptjs');

var password = '123abc!';

// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash);
//   });
// });

var hashPassword = '$2a$10$LYTLYtpTXvp/UglZgBMcwumohep4LaSBkDaGpgQvEmKTZCPmqjsPq';

bcrypt.compare(password, hashPassword, (err, res) => {
  console.log(res);
});

var data = {
  id: 41
};

var token = jwt.sign(data, '123abc');
console.log(`Token: ${token}` );

var decoded = jwt.verify(token, '123abc');

console.log(`Decoded: ${util.inspect(decoded)}`);

// var message = 'I am user number 3';
// var hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);
//
// var data = {
//   id: 4
// };
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
//
// // token.data.id =5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if(resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('Data was changed, dont trust');
// }

const bcrypt = require('bcrypt');
const saltRounds = 5;

exports.generatePasswordHash = (pwd) =>
  new Promise((resolve, reject) => {
    bcrypt.hash(pwd, saltRounds, function (err, hash) {
      if (err) {
        console.log('Error in encryptionHelper :generatePasswordHash', err);
        reject(err);
      }
      resolve(hash);
    });
  });


exports.comparePassword = (pwd, hash) =>
  new Promise((resolve, reject) => {
    bcrypt.compare(pwd, hash, function (err, res) {
      if (err) {
        console.log('Error in encryptionHelper :' +
          ' comparePassword', err);
        reject(err);
      }
      resolve(res);
    });
  });

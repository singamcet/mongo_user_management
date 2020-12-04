var jwt = require('jsonwebtoken');
const secretKey = "testsecretkey"

exports.generateToken = (payload) =>
    jwt.sign(payload, secretKey,
        {
            expiresIn: "1d"
        });


exports.decodeToken = (token) =>
    new Promise((resolve, reject) => {
        try {
            let decoded = jwt.verify(token, secretKey);
            resolve(decoded);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                throw new Error("TokenExpiredError")
            } else {
                throw new Error("unAuthorized")
            }
        }
    });



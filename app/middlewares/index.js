const jwt = require("./../services/jwtService")

exports.authorizer = async (req, res, next) => {
    if (req.headers.authorization) {
      let token = req.headers.authorization.split(' ')[1];
      try {
        let decoded = await jwt.decodeToken(token);
        req.body.tokenDetails = decoded;
        next();
      } catch (error) {
        res.status(403)
          .json({
            code :'inValid',
            message : 'Invalid token'
        });
      }
    } else {
      res.status(401)
        .json({
            code :'unAuthorized',
            message : 'No token present'
        });
    }
  }



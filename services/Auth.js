const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = verify;

function verify(req, res, next) {
  if (req.method === 'OPTIONS') {
    return next();
  }
  // check header or url parameters or post parameters for token
  const token = req.headers.authorization || req.body.token || req.query.token;
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token.replace('Bearer ', ''), config.secret, function (err, decoded) {
      if (err) {
        return res.send({success: false, message: 'Failed to authenticate token.'});
      } else {
        // if everything is good, save to request for use in other routes
        req._currentUser = decoded;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'Not authorized user.'
    });

  }
}
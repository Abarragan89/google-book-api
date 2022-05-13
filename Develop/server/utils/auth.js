const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  signToken: function({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
  authMiddleware: function({ req }) {
    // token can be sent via req.body, req.query or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // if in headers, separate from "Bearer"
    if(req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }
    // if no token, return request object as is
    if(!token) {
      return req;
    }
    try {
      // decoded and attach user data to request object
      // jwt.verify returns the payload decoded if signature and other options are valid. 
      const { data } = jwt.verify(token, secret, {
        maxAge: expiration });

        req.user = data;
    } catch {
      console.log('Invalid token');
    }
    // return the req object that now has the .user property with the decoded user data. 
    return req;
  }
}

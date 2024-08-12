const jwt = require("jsonwebtoken");
const Admin = require("../schemas/user.schema");
const SuperAdmin = require("../schemas/superadmin.schema");

let middleware = {};

middleware.adminVerification = adminVerification;
middleware.superAdminVerification = superAdminVerification;

async function adminVerification(req, res, next) {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.TOKEN_KEY);
      req.user = await Admin.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      return res.status(401).send('Authentication failed, please login again!');
    }
  } else {
    return res.status(401).send('Not authorized');
  }
}

async function superAdminVerification(req, res, next) {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.TOKEN_KEY);
      // if (!activeTokens[decoded.id] || activeTokens[decoded.id] !== token) {
      //   return res.status(401).send('Invalid token');
      // }
      req.user = await SuperAdmin.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      return res.status(401).send('Authentication failed, please login again!');
    }
  } else {
    return res.status(401).send('Not authorized');
  }
}

module.exports = middleware;
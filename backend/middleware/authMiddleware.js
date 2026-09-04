const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes
const requireAuth = (req, res, next) => {
  // Allow internal service calls (e.g. from Python ML service)
  if (req.headers["x-internal-service"] === "ml-service") {
    return next();
  }

  const authHeader = req.headers.authorization;

  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : req.cookies.jwt;

  if (!token) {
    return res.status(401).json({
      message: "Authentication required."
    });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET,
    (err, decodedToken) => {
      if (err) {
        console.log(err.message);

        return res.status(401).json({
          message:
            "Your session has expired. Please log in again."
        });
      }

      req.userId = decodedToken.id;

      next();
    }
  );
};


// Check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    res.locals.user = null;
    return next();
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET,
    async (err, decodedToken) => {
      if (err) {
        console.log(err.message);

        res.locals.user = null;
        return next();
      }

      try {
        const user = await User.findById(
          decodedToken.id
        );

        res.locals.user = user || null;

        next();
      } catch (error) {
        console.log(error.message);

        res.locals.user = null;

        next();
      }
    }
  );
};


module.exports = {
  requireAuth,
  checkUser
};
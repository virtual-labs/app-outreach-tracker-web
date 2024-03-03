const { UnauthenticatedError } = require("../errors");
const { authorizeUser } = require("../controllers/login");

async function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({
      message: "Authentication invalid",
    });
  }
  const token = authHeader.split(" ")[1];

  try {
    const user = await authorizeUser(token);
    if (user.error) {
      return res.status(401).json({
        message: user.message,
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    throw new UnauthenticatedError("Authentication invalid");
  }
}

module.exports = authenticateUser;

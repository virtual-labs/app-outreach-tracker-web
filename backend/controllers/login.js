const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const { getUsersList } = require("../utils/sheet");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

async function verifyGoogleToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    return { payload: ticket.getPayload() };
  } catch (error) {
    return { error: "Invalid user detected. Please try again" };
  }
}

const authorizeUser = async (token) => {
  const verificationResponse = await verifyGoogleToken(token);
  if (verificationResponse.error) {
    return { error: true, message: verificationResponse.error };
  }
  const profile = verificationResponse?.payload;

  const email = profile?.email;

  const { admins, coordinators } = await getUsersList();
  if (!admins.includes(email) && !coordinators.includes(email)) {
    return { error: true, message: "Unauthorized" };
  }

  let user = {
    firstName: profile?.given_name,
    lastName: profile?.family_name,
    picture: profile?.picture,
    email: profile?.email,
    token: jwt.sign({ email: profile?.email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    }),
  };

  if (admins.includes(email)) {
    user = {
      ...user,
      role: "admin",
    };
  } else if (coordinators.includes(email)) {
    user = {
      ...user,
      role: "coordinator",
    };
  }

  return user;
};

const login = async (req, res) => {
  try {
    console.log(req.body);
    if (req.body.credential) {
      const user = await authorizeUser(req.body.credential);
      if (user.error) {
        return res.status(401).json({
          message: user.message,
        });
      }
      res.status(201).json({
        message: "Login was successful",
        user,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error?.message || error,
    });
  }
};

module.exports = { login, authorizeUser };

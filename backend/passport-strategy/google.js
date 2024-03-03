const GoogleStrategy = require("passport-google-oauth20").Strategy;

const { getUsersList } = require("../utils/sheet");

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    const userEmail = profile.emails[0].value;

    const { admins: adminIds, coordinators: coordinatorIds } =
      await getUsersList();

    if (adminIds.includes(userEmail)) {
      profile.role = "admin";
    } else if (coordinatorIds.includes(userEmail)) {
      profile.role = "coordinator";
    } else {
      console.log("Unauthorized user");
      return done(null, false, { message: "Unauthorized user" });
    }
    return done(null, profile);
  }
);

module.exports = googleStrategy;

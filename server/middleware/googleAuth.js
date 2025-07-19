const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI // Usa el valor del .env
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Validar que Google envió email y foto
      const email = profile.emails && profile.emails[0] && profile.emails[0].value;
      const photo = profile.photos && profile.photos[0] && profile.photos[0].value;
      if (!email) return done(new Error('No email from Google'), null);

      let user = await User.findOne({ email });
      if (user) {
        // Actualiza la foto de perfil si cambió
        if (photo && user.profile_picture !== photo) {
          user.profile_picture = photo;
          await user.save();
        }
        return done(null, user);
      } else {
        // Nuevo usuario
        user = new User({
          name: profile.displayName || email,
          email,
          password: undefined, // No requerir password para Google
          profile_picture: photo,
          phone: profile.phoneNumbers && profile.phoneNumbers[0] && profile.phoneNumbers[0].value ? profile.phoneNumbers[0].value : undefined,
          role: 'user',
          status: 'active'
        });
        await user.save();
        return done(null, user);
      }
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

module.exports = passport;
const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const db = require('./database');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new Strategy(options, async (payload, done) => {
    try {
      const query = 'SELECT * FROM users WHERE id = ?';
      console.log('payload', payload);
      const results = await db.query(query, [payload.id]);
      console.log('results', results);

      if (!Array.isArray(results)) {
        throw new Error('Query did not return an array');
      }

      const [user] = results;
      console.log('user', user);

      if (user) {
        return done(null, user);
      }

      return done(null, false);
    } catch (error) {
      console.error('Error in Passport strategy:', error);
      return done(error, false);
    }
  })
);

module.exports = passport;
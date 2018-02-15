import HttpBearer from 'passport-http-bearer';
import passport from 'passport';

import {
  fromMongo,
} from '../lib/dbConnector';
import { Client } from '../models';

const { Strategy } = HttpBearer;

// PASSPORT SETTING
passport.use(new Strategy(async (apiKey, cb) => {
  try {
    const client = await Client.findOne({ apiKey }).lean().exec();
    if (!client) {
      return cb(null, { unauthorized: true });
    }
    return cb(null, fromMongo(client));
  } catch (error) {
    return cb(null, { unauthorized: true });
  }
}));

export default function (req, res, next) {
  passport.authenticate('bearer', { session: false }, (err, user) => {
    const userFound =
      user && !Object.hasOwnProperty.call(user, 'unauthorized') && !user.unauthorized ?
        user : null;
    if (err) { return next(err); }
    if (!userFound) { return res.status(401).json({ message: 'unauthorized' }); }
    delete userFound.password;
    req.user = userFound;
    return next();
  })(req, res, next);
}

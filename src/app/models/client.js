import mongoose from 'mongoose';
import Bcrypt from 'bcrypt';
import Promise from 'bluebird';
import generateKey from '../lib/generateKey';

const bcrypt = Promise.promisifyAll(Bcrypt);
const { Schema } = mongoose;
const Client = new Schema({
  email: {
    type: String,
    required: true,
    index: {
      unique: true,
    },
    match: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  created: {
    type: Date,
    required: true,
    default: new Date(),
  },
  apiKey: {
    type: String,
    required: true,
    default: generateKey(),
  },
  phone: {
    type: String,
  },
  passwordChangeToken: {
    type: String,
  },
  requestForRemove: {
    type: Date,
  },
});
Client.pre('save', async function hashing(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    this.password = await bcrypt.hash(this.password, 10);
    return next();
  } catch (error) {
    return next(error);
  }
});
Client.pre('updateOne', async function hashing(next) {
  const u = this.getUpdate();
  const update = u.$set;
  if (update && update.password) {
    try {
      const prevPassword = update.password;
      delete update.password;
      update.password = await bcrypt.hash(prevPassword, 10);
      u.$set = update;
    } catch (error) {
      return next(error);
    }
  }
  this.update({}, u);
  return next();
});
Client.methods.passwordIsValid = function passwordIsValid(password) {
  try {
    return bcrypt.compareAsync(password, this.password);
  } catch (err) {
    throw err;
  }
};
const model = mongoose.model('client', Client);

export default model;

import mongoose, { Schema, Document } from 'mongoose';
import HttpError, { clientErrorCodes, serverErrorCodes } from 'http-error-types';
import bcrypt from 'bcrypt';
import { number, string } from 'joi';

function now(): number {
  return new Date().getTime();
}

const saltRounds = 10;
const mainSchema = new Schema({
  dateCreated: Date,
  dateUpdated: Date,
  username: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 30,
  },
  salt: {
    type: String,
    required: true,
    minlength: 20,
    maxlength: 40,
  },
  password: {
    type: String,
    required: true,
    minlength: 50,
    maxlength: 70,
  },
  recoveryMethod: {
    type: String,
    enum: ['email', 'phone'],
  },
  recoveryEmail: {
    type: Schema.Types.ObjectId,
    ref: 'emails',
  },
  recoveryPhoneNumber: {
    type: Schema.Types.ObjectId,
    ref: 'phoneNumbers',
  },
  profiles: {
    type: [Schema.Types.ObjectId],
    ref: 'profiles',
    default: [],
  },
  emails: {
    type: [Schema.Types.ObjectId],
    ref: 'emails',
    default: [],
  },
});
const model = mongoose.model('users', mainSchema);

/** Extends the basic mongoose document with the custom properties */
interface UsersDocument extends Document {
  dateCreated: Date;
  dateUpdated: Date;
  username: string;
  salt: string;
  password: string;
  recoveryEmail: mongoose.Types.ObjectId;
  recoveryPhoneNumber: mongoose.Types.ObjectId;
  profiles: [mongoose.Types.ObjectId];
  emails: [mongoose.Types.ObjectId];
}

/** Defines the output object of the registerUser function */
export type UserResults = {
  userId: string;
  username: string;
  recoveryEmail?: string;
  recoveryPhoneNumber?: string;
}

/**
 * Authenticates a username and password
 * @param username the unique username associated to the account
 * @param password the security has for verifying ownership of the account
 */
async function authenticateUser(username: string, password: string): Promise<UserResults> {
  const user = await model.findOne({ username }) as UsersDocument;
  if (!user) {
    throw new HttpError(clientErrorCodes.badRequest, 'Username or password is invalid');
  }
  const hashedPassword = await bcrypt.hash(password, user.salt);
  if (hashedPassword !== user.password) {
    throw new HttpError(clientErrorCodes.badRequest, 'Username or password is invalid');
  }
  return {
    userId: user.id,
    username: user.username,
    recoveryEmail: user.recoveryEmail.toHexString(),
    recoveryPhoneNumber: user.recoveryPhoneNumber.toHexString(),
  };
}

/**
 * Validates if the username is already in use
 * @param username The username to check against
 */
async function existsUsername(username: string): Promise<boolean> {
  const user = await model.findOne({ username });
  if (user) {
    return true;
  }
  return false;
}

/**
 * Validates if the username is already in use
 * @param userId The user ID to check against
 */
async function existsUserID(userId: string): Promise<boolean> {
  const user = await model.findOne({ _id: userId });
  if (user) {
    return true;
  }
  return false;
}

/**
 * Registers a new user record
 * @param username The new user name to register
 * @param password The security password to use. Should be a bcrypt hash value
 */
async function registerUser(username: string, password: string): Promise<UserResults> {
  const d = now();
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  const result: unknown = await (await model.insertMany({
    dateCreated: d,
    dateUpdated: d,
    username,
    salt,
    password: hashedPassword,
  }));
  const documents = (result as [mongoose.Document]);
  if (documents.length <= 0) {
    throw new HttpError(serverErrorCodes.internalServer, 'User registration failed');
  }
  const doc1 = documents[0] as UsersDocument;
  return {
    userId: doc1.id,
    username: doc1.username,
  };
}

export default {
  authenticateUser,
  existsUsername,
  existsUserID,
  registerUser,
};

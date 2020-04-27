import mongoose, { Schema } from 'mongoose';
import { addDBLog, DBEventTypes } from './DBLogs';

const COLLECTION_NAME = 'profiles';

function now(): number {
  return new Date().getTime();
}

const schema = new Schema({
  dateCreated: Date,
  dateUpdated: Date,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    index: true,
    minlength: 2,
    maxlength: 30,
  },
  profileName: {
    type: String,
    minlength: 5,
    maxLength: 50,
  },
  emails: {
    type: [Schema.Types.ObjectId],
    ref: 'emails',
    default: [],
    index: true,
  },
  phoneNumbers: {
    type: [Schema.Types.ObjectId],
    ref: 'phoneNumbers',
    default: [],
    index: true,
  },
  dateOfBirth: {
    type: Date,
    index: true,
  },
  countryCodeBirth: {
    type: String,
    minlength: 2,
    maxlength: 2,
  },
});
const model = mongoose.model(COLLECTION_NAME, schema);

async function registerProfile(
  userId: string, profileName: string, dateOfBirth: Date, countryCodeBirth: string,
): Promise<boolean> {
  const d = now();
  await model.insertMany({
    dateCreated: d,
    dateUpdated: d,
    profileName,
    userId,
    dateOfBirth,
    countryCodeBirth,
  });
  addDBLog(COLLECTION_NAME, userId, DBEventTypes.created, `Profile "${profileName}" created!`);
  return false;
}

export default {
  register: registerProfile,
};

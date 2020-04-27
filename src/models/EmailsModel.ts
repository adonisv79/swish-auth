import mongoose, { Schema } from 'mongoose';
import HttpError, { serverErrorCodes } from 'http-error-types';
import { addDBLog, DBEventTypes } from './DBLogs';

const COLLECTION_NAME = 'emails';

function now(): number {
  return new Date().getTime();
}

const emailRegex = new RegExp('/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@'
  + '((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/');

export enum EmailUsageTypes {
  'personal', 'work', 'others'
}

const usageSchema = new Schema({
  type: String,
  enum: ['personal', 'work', 'others'],
});

const emailSchema = new Schema({
  dateCreated: Date,
  dateUpdated: Date,
  emailAddress: {
    type: String,
    required: true,
    index: true,
    lowercase: true,
    unique: true,
    minlength: 3,
    maxlength: 150,
    match: emailRegex,
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  usages: {
    type: [usageSchema],
    required: true,
    default: 'personal',
  },
});

const model = mongoose.model(COLLECTION_NAME, emailSchema);

async function isUsedEmail(emailAddress: string): Promise<boolean> {
  const count = await model.count({ emailAddress });
  if (count > 0) { return true; }
  return false;
}

async function registerEmail(userId: string, emailAddress: string, usages: [EmailUsageTypes]): Promise<boolean> {
  const d = now();
  await model.insertMany({
    dateCreated: d,
    dateUpdated: d,
    emailAddress,
    isVerified: false,
    usages,
  });
  addDBLog(COLLECTION_NAME, userId, DBEventTypes.created, `"${emailAddress}" registered!`);
  return true;
}

async function markAsVerified(userId: string, emailAddress: string): Promise<boolean> {
  const d = now();
  await model.update({ emailAddress }, { dateUpdated: d, isVerified: true });
  addDBLog(COLLECTION_NAME, userId, DBEventTypes.updated, `"${emailAddress}" verified!`);
  return true;
}

export default {
  isUsed: isUsedEmail,
  register: registerEmail,
  verified: markAsVerified,
};

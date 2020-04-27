import mongoose, { Schema } from 'mongoose';
import { addDBLog, DBEventTypes } from './DBLogs';

const COLLECTION_NAME = 'phoneNumbers';

function now(): number {
  return new Date().getTime();
}
export enum PhoneNumberUsageTypes {
  'personal', 'work', 'others'
}

const usageSchema = new Schema({
  type: String,
  enum: ['personal', 'work', 'others'],
});

export const PhoneNumberSchema = new Schema({
  countryCallingCode: {
    type: Number,
    required: true,
    min: 1,
    max: 1999,
  },
  areaCode: {
    type: Number,
    required: false,
    min: 0,
    max: 999,
  },
  identityNumber: {
    type: Number,
    required: true,
    min: 1000,
    max: 9999999999,
  },
});

const phoneNumberRecordSchema = new Schema({
  dateCreated: Date,
  dateUpdated: Date,
  countryCallingCode: {
    type: Number,
    required: true,
    index: true,
    min: 1,
    max: 1999,
  },
  areaCode: {
    type: Number,
    required: false,
    min: 0,
    max: 999,
  },
  identityNumber: {
    type: Number,
    required: true,
    min: 1000,
    max: 9999999999,
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

const model = mongoose.model(COLLECTION_NAME, phoneNumberRecordSchema);

async function isUsedPhone(countryCallingCode: number, areaCode: number, identityNumber: number): Promise<boolean> {
  const count = await model.count({ countryCallingCode, areaCode, identityNumber });
  if (count > 0) { return true; }
  return false;
}

export async function parseFullNumber(countryCallingCode: number, areaCode: number, identityNumber: number): Promise<string> {
  let fullNumber = `+(${countryCallingCode}) `;
  if (areaCode) { fullNumber += `(${areaCode}) `; }
  fullNumber += identityNumber;
  return fullNumber;
}

async function registerPhone(
  userId: string, countryCallingCode: number, areaCode: number, identityNumber: number, usages: [PhoneNumberUsageTypes],
): Promise<boolean> {
  const d = now();
  await model.insertMany({
    dateCreated: d,
    dateUpdated: d,
    countryCallingCode,
    areaCode,
    identityNumber,
    isVerified: false,
    usages,
  });
  addDBLog(COLLECTION_NAME, userId, DBEventTypes.created, `"(${parseFullNumber(countryCallingCode, areaCode, identityNumber)})" registered!`);
  return true;
}

async function markAsVerified(userId: string, countryCallingCode: number, areaCode: number, identityNumber: number): Promise<boolean> {
  const d = now();
  await model.update({ countryCallingCode, areaCode, identityNumber }, { dateUpdated: d, isVerified: true });
  addDBLog(COLLECTION_NAME, userId, DBEventTypes.updated, `"(${parseFullNumber(countryCallingCode, areaCode, identityNumber)}" verified!`);
  return true;
}

export default {
  isUsed: isUsedPhone,
  register: registerPhone,
  verified: markAsVerified,
};

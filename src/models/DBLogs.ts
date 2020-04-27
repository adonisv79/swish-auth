import mongoose, { Schema } from 'mongoose';

function now(): number {
  return new Date().getTime();
}

export enum DBEventTypes {
  'created', 'updated', 'deleted'
}

const eventTypesSchema = new Schema({
  type: String,
  enum: ['personal', 'work', 'others'],
});

const dbLogsSchema = new Schema({
  dateCreated: Date,
  collection: {
    type: String,
    required: true,
    index: true,
    lowercase: true,
    unique: true,
    minlength: 3,
    maxlength: 150,
  },
  triggeredBy: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 150,
  },
  eventType: {
    type: eventTypesSchema,
    required: true,
  },
  details: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 150,
  },
});

const model = mongoose.model('dbLogs', dbLogsSchema);

export async function addDBLog(collection: string, triggeredBy: string, eventType: DBEventTypes, details: string, ): Promise<boolean> {
  const d = now();
  const r = await model.insertMany({
    dateCreated: d,
    collection,
    triggeredBy,
    eventType,
    details,
  });
  console.log(r);
  return false;
}
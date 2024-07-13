import { Schema, model } from 'mongoose';
import { typeList } from '../constants/contacts.js';
import { mongooseSaveError, setUpdateSettings } from './hooks.js';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: String,
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      required: true,
      enum: typeList,
      default: 'personal',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
contactSchema.post('save', mongooseSaveError);
contactSchema.pre('findOneAndUpdate', setUpdateSettings);
contactSchema.post('findOneAndUpdate', mongooseSaveError);

const Contact = model('contact', contactSchema);
export default Contact;

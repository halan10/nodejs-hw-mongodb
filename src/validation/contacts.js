import Joi from 'joi';
import { typeList, phoneNumberRegexp } from '../constants/contacts.js';

export const contactAddShema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'string.base': 'Name should be a string',
    'string.min': 'Name should have at least {#limit} characters',
    'string.max': 'Name should have at most {#limit} characters',
    'any.required': 'Name is required',
  }),
  phoneNumber: Joi.string().required().pattern(phoneNumberRegexp).messages({
    'string.pattern.base': `Phone number must have 12 digits and start with plus.`,
  }),
  email: Joi.string()
    .min(3)
    .max(30)
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .messages({
      'string.email': 'Please enter a valid email address.',
    }),
  contactType: Joi.string().valid(...typeList),
});

export const contactUpdateShema = Joi.object({
  name: Joi.string().min(3).max(30).messages({
    'string.base': 'Name should be a string',
    'string.min': 'Name should have at least {#limit} characters',
    'string.max': 'Name should have at most {#limit} characters',
  }),
  phoneNumber: Joi.string().pattern(phoneNumberRegexp).messages({
    'string.pattern.base': `Phone number must have 12 digits and start with plus.`,
  }),
  email: Joi.string()
    .min(3)
    .max(30)
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .messages({
      'string.email': 'Please enter a valid email address.',
    }),
  contactType: Joi.string().valid(...typeList),
});

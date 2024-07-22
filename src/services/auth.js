import { randomBytes } from 'node:crypto';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import env from '../utils/env.js';
import { sendEmail } from '../utils/sendMail.js';

import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

import User from '../db/User.js';
import Session from '../db/Session.js';
import { hashValue } from '../utils/hash.js';

import {
  ACCESS_TOKEN_LIFETIME,
  REFRESH_TOKEN_LIFETIME,
  TEMPLATES_DIR,
} from '../constants/index.js';

export const findUser = (filter) => User.findOne(filter);
export const register = async (data) => {
  const { password } = data;
  const hashPassword = await hashValue(password);
  return User.create({ ...data, password: hashPassword });
};

export const findSession = (filter) => Session.findOne(filter);
export const createSession = async (userId) => {
  await Session.deleteOne({ userId });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  const accessTokenValidUntil = new Date(Date.now() + ACCESS_TOKEN_LIFETIME);
  const refreshTokenValidUntil = new Date(Date.now() + REFRESH_TOKEN_LIFETIME);

  return Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });
};

export const deleteSession = (filter) => Session.deleteOne(filter);

export const requestResetToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );
  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  try {
    await sendEmail({
      from: env('SMTP_FROM'),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (error) {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
      error,
    );
  }
};
export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, env('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error)
      throw createHttpError(401, 'Token is expired or invalid.');
    throw err;
  }

  const user = await User.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await hashValue(payload.password);

  await User.updateOne({ _id: user._id }, { password: encryptedPassword });
  await Session.deleteOne({ userId: user._id });
};

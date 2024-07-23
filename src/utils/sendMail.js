import nodemailer from 'nodemailer';
import 'dotenv/config';

import env from '../utils/env.js';

const smpt_host = env('SMTP_HOST');
const smpt_key = env('SMTP_PORT');
const smpt_user = env('SMTP_USER');
const smpt_password = env('SMTP_PASSWORD');

const transporter = nodemailer.createTransport({
  host: smpt_host,
  port: Number(smpt_key),
  auth: {
    user: smpt_user,
    pass: smpt_password,
  },
});

export const sendEmail = async (options) => {
  return await transporter.sendMail(options);
};

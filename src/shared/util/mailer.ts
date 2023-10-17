import * as nodemailer from 'nodemailer';

const EMAIL_USERNAME: string = 'casperlay.akm@gmail.com';
const COMMON_NAME: string = 'Cas M';

const smtpSettings = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  from: `"${COMMON_NAME}" <${EMAIL_USERNAME}>`,
  auth: {
    user: 'casperlay.akm@gmail.com',
    pass: '09402689005'
  }
} as nodemailer.TransportOptions;

export const emailTransport = nodemailer.createTransport(smtpSettings);

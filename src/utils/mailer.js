import bcryptjs from 'bcryptjs';
import * as crypto from 'crypto'
import nodemailer from 'nodemailer';
import logger from './logger.js';
import * as configurationProvider from '../libraries/configuration-provider/index.js';

const generateResetTokenTemp = async (userId) => {
  let token;

  token = crypto.randomBytes(32).toString('hex');

  const hashedToken = await bcryptjs.hash(token, 10);

  return hashedToken;
};
const setupMailSender = async (emailReceiver, subject, html) => {
  logger.info(`sending mail to ${emailReceiver}`);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: configurationProvider.getValue('mailer.user'),
      pass: configurationProvider.getValue('mailer.key'),
    },
  });

  const mailOptions = {
    from: configurationProvider.getValue('mailer.user'),
    to:emailReceiver,
    subject: subject,
    html: html,
  };
  
  await transporter.sendMail(mailOptions);
};

export { setupMailSender, generateResetTokenTemp };

import bcryptjs from 'bcryptjs';
import * as crypto from 'crypto';
import nodemailer from 'nodemailer';
import logger from './logger';
import * as configurationProvider from '../libraries/configuration-provider/index';
import { IUser } from '../components/user/data-access/interfaces/user.interface.js';

const generateResetTokenTemp = async () => {
  const token: string = crypto.randomBytes(32).toString('hex');
  const hashedToken: string = await bcryptjs.hash(token, 10);
  return hashedToken;
};
const setupMailSender = async (
  receiverEmail: string,
  subject: string,
  html: string
) => {
  logger.info(`sending mail to ${receiverEmail}`);
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: configurationProvider.getValue('mailer.user'),
        pass: configurationProvider.getValue('mailer.key'),
      },
    });
    const mailOptions = {
      from: configurationProvider.getValue('mailer.user'),
      to: receiverEmail,
      subject: subject,
      html: html,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error(`Mailer Error : ${error}`);
    throw new Error('An Error Occurred While Sending The Mail');
  }
};

export { setupMailSender, generateResetTokenTemp };

import * as configurationProvider from '@libs/configuration-provider/index';
import logger from '@utils/logger';
import bcryptjs from 'bcryptjs';
import * as crypto from 'crypto';
import nodemailer from 'nodemailer';

import { createHtmlPage } from './html-loader';

const generateResetTokenTemp = async () => {
  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = await bcryptjs.hash(token, 10);
  return hashedToken;
};

const createTransporter = async (
  receiverEmail: string,
  subject: string,
  content: string,
  isActivationEmail: boolean = false,
  token: string = ''
) => {
  const html = await createHtmlPage(subject, content, isActivationEmail, token);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: configurationProvider.getValue('mailer.user'),
      pass: configurationProvider.getValue('mailer.key'),
    },
  });

  const mailOptions = {
    from: configurationProvider.getValue('mailer.user') as string,
    to: receiverEmail,
    subject: subject,
    html: html,
  };

  return {
    sendMail: async () => {
      await transporter.sendMail(mailOptions);
    },
  };
};

const setupMailSender = async (receiverEmail: string, subject: string, content: string) => {
  logger.info(`sending mail to ${receiverEmail}`);
  try {
    const transporter = await createTransporter(receiverEmail, subject, content);
    await transporter.sendMail();
  } catch (error) {
    logger.error(`Mailer Error : ${error}`);
    throw new Error('An Error Occurred While Sending The Mail');
  }
};

const sendActivationEmail = async (receiverEmail: string, token: string) => {
  logger.info(`sending mail to ${receiverEmail}`);
  try {
    const transporter = await createTransporter(
      receiverEmail,
      'Activate Your Account',
      "Welcome to Subul Organization! We're excited to have you on board. To get started, please activate your account by clicking the button below.",
      true,
      token
    );
    await transporter.sendMail();
  } catch (error) {
    logger.error(`Mailer Error : ${error}`);
    throw new Error('An Error Occurred While Sending The Mail');
  }
};

export { setupMailSender, generateResetTokenTemp, sendActivationEmail };

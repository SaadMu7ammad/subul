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
  emailType: 'alert' | 'activation' = 'alert',
  token: string = ''
) => {
  const html = await createHtmlPage(subject, content, emailType, token);

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
    const encodedToken = encodeURIComponent(token);

    const transporter = await createTransporter(
      receiverEmail,
      'Activate Your Account',
      "Welcome to Subul Organization! We're excited to have you on board. To get started, please activate your account by clicking the button below.",
      'activation',
      encodedToken
    );

    await transporter.sendMail();
  } catch (error) {
    logger.error(`Mailer Error : ${error}`);
    throw new Error('An Error Occurred While Sending The Mail');
  }
};

const sendReactivationEmail = async (receiverEmail: string, token: string) => {
  logger.info(`sending mail to ${receiverEmail}`);
  try {
    const encodedToken = encodeURIComponent(token);

    const transporter = await createTransporter(
      receiverEmail,
      'Reactivate Your Account',
      'Your Email Has Been Changed! Please reactivate your account by clicking the button below.',
      'activation',
      encodedToken
    );
    await transporter.sendMail();
  } catch (error) {
    logger.error(`Mailer Error : ${error}`);
    throw new Error('An Error Occurred While Sending The Mail');
  }
};

// Frontend Team has no time to make the reset password page 🥲
const sendResetPasswordEmail = async (receiverEmail: string, token: string) => {
  logger.info(`sending mail to ${receiverEmail}`);
  try {
    const encodedToken = encodeURIComponent(token);

    const transporter = await createTransporter(
      receiverEmail,
      'Reset Your Password',
      `You are receiving this email because you requested to reset your password. Please use this token to reset your password.\n ${encodedToken}`,
      'alert'
    );
    await transporter.sendMail();
  } catch (error) {
    logger.error(`Mailer Error : ${error}`);
    throw new Error('An Error Occurred While Sending The Mail');
  }
};

const sendActivationEmailFromMobile = async (receiverEmail: string, token: string) => {
  logger.info(`sending mail to ${receiverEmail}`);
  try {
    const encodedToken = encodeURIComponent(token);

    const transporter = await createTransporter(
      receiverEmail,
      'Activate Your Account',
      `Welcome to Subul Organization! We're excited to have you on board. To get started, please copy this token and paste it in the app to activate your account.\n ${encodedToken}`,
      'alert'
    );
    await transporter.sendMail();
  } catch (error) {
    logger.error(`Mailer Error : ${error}`);
    throw new Error('An Error Occurred While Sending The Mail');
  }
};

export {
  setupMailSender,
  generateResetTokenTemp,
  sendActivationEmail,
  sendReactivationEmail,
  sendResetPasswordEmail,
  sendActivationEmailFromMobile,
};

import bcrypt from 'bcryptjs';
import * as crypto from 'crypto'
import nodemailer from 'nodemailer';
import logger from './logger.js';
const generateResetTokenTemp = async (userId) => {
  // console.log('ahpe');
  let token; //= await Token.findOne({ userId});
  // if (token) {
  //     await token.remove();
  // }
  token = crypto.randomBytes(32).toString('hex');
  const hashedToken = await bcrypt.hash(token, 10);
  // const resetPassowrdToken = new Token({
  //     userId,
  //     token:hashedToken,
  // });
  // await resetPassowrdToken.save();
  return hashedToken;
};
const setupMailSender = async (emailReceiver, subject, html) => {
  logger.info(`sending mail to ${emailReceiver}`);
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_KEY,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to:emailReceiver,
    subject: subject,
    html: html,
  };
  await transporter.sendMail(mailOptions);
};

export { setupMailSender, generateResetTokenTemp };

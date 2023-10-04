import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
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
  return token;
};
const setupMailSender = async (req, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_KEY,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: req.body.email,
    subject: subject,
    html: html,
  };
  await transporter.sendMail(mailOptions);
};

export { setupMailSender, generateResetTokenTemp };

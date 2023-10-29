import fs from 'fs';
import path from 'path';

import Charity from '../models/charityModel.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from 'express-async-handler';
import { setupMailSender, generateResetTokenTemp } from '../utils/mailer.js';
import dot from 'dot-object';

import {
  BadRequestError,
  CustomAPIError,
  NotFoundError,
  UnauthenticatedError,
} from '../errors/index.js';
import { deleteOldImgsLogos } from '../middlewares/imageMiddleware.js';
// import logger from '../utils/logger.js';

const registerCharity = asyncHandler(async (req, res, next) => {
  // logger.info(req.file.path);
  // req.file.path=req.file.path.replace("\\","/")
  const { email } = req.body;

  let charity = await Charity.findOne({ email });
  if (charity) {
    deleteOldImgsLogos(req,res,next)
    throw new BadRequestError('An Account with this Email already exists');
  }

  charity = await Charity.create(req.body);
  if (!charity) {
    deleteOldImgsLogos(req,res,next)
    throw new Error('Something went wrong');

  }
  generateToken(res, charity._id, 'charity');
  await setupMailSender(
    req,
    'welcome alert',
    'Hi ' +
      charity.name +
      ' We are happy that you joined our community💚 ... keep spreading goodness with us'
  );
  res.status(201).json({
    _id: charity._id,
    name: charity.name,
    email,
    image: charity.image, //notice the image url return as a imgUrl on the fly not in the db itself
  });
});

const authCharity = asyncHandler(async (req, res, next) => {
  //get email & password => checkthem
  //send activation token email if not activated
  //make a token ...
  const { email, password } = req.body;
  const charity = await Charity.findOne({ email });
  if (!charity) throw new NotFoundError('No charity found with this email');
  const isMatch = await charity.comparePassword(password);
  if (!isMatch) throw new UnauthenticatedError('Invalid password!');
  generateToken(res, charity._id, 'charity');
  //first stage
  if (
    !charity.emailVerification.isVerified &&
    !charity.phoneVerification.isVerified
  ) {
    //not verified(activated)
    const token = await generateResetTokenTemp();
    charity.verificationCode = token;
    await charity.save();
    await setupMailSender(
      req,
      'login alert',
      'it seems that your account still not verified or activated please go to that link to activate the account ' +
        `<h3>(www.activate.com)</h3>` +
        `<h3>use that token to confirm the new password</h3> <h2>${token}</h2>`
    );
  }
  //second stage
  //isPending = true and isConfirmed= false
  if (!charity.isConfirmed && charity.isPending) {
    res.status(200).json([
      {
        id: charity._id,
        email: charity.email,
        name: charity.name,
      },
      { message: 'charity docs will be reviewed' },
    ]);
  } //isPending = false and isConfirmed= false
  else if (!charity.isConfirmed && !charity.isPending) {
    res.status(200).json([
      {
        id: charity._id,
        email: charity.email,
        name: charity.name,
      },
      { message: 'you must upload docs to auth the charity' },
    ]);
    //isPending = false and isConfirmed= true
    //done
  } else if (charity.isConfirmed && !charity.isPending) {
    res.status(200).json([
      {
        id: charity._id,
        email: charity.email,
        name: charity.name,
      },
      { message: 'you are ready' },
    ]);
  }
});

const activateCharityAccount = asyncHandler(async (req, res, next) => {
  let charity = await Charity.findById(req.charity._id);
  if (!charity) {
    throw new UnauthenticatedError(
      'you are not authorized to activate the account'
    );
  }
  if (charity.emailVerification.isVerified) {
    return res.status(200).json({ message: 'account already is activated' });
  }
  if (charity.verificationCode !== req.body.token) {
    charity.verificationCode = null;
    charity = await charity.save();
    // logoutUser(req, res, next);
    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0),
    });
    // await setupMailSender(
    //   req,
    //   'account still not activated',
    //   '<h3>contact us if there is another issue about </h3>' );
    throw new UnauthenticatedError('invalid token you have been logged out');
  }

  charity.verificationCode = null;
  charity.emailVerification.isVerified = true;
  charity.emailVerification.verificationDate = Date.now();
  charity = await charity.save();
  await setupMailSender(
    req,
    'account has been activated ',
    `<h2>now you are ready to spread the goodness with us </h2>`
  );

  res.status(201).json({
    message: 'account has been activated successfully',
  });
});

const requestResetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const charity = await Charity.findOne({ email });
  if (!charity) throw new NotFoundError('No charity found with this email');
  const token = await generateResetTokenTemp();
  await setupMailSender(
    req,
    'Password Reset Alert',
    'go to that link to reset the password (www.dummy.com) ' +
      `<h3>use that token to confirm the new password</h3> <h2>${token}</h2>`
  );
  charity.verificationCode = token;
  await charity.save();
  res.status(200).json({
    message: 'email sent successfully to reset the password',
  });
});

const confirmResetPasswordRequest = asyncHandler(async (req, res, next) => {
  const { token, email } = req.body;
  let charity = await Charity.findOne({ email });
  if (!charity) throw new NotFoundError('No charity found with this email');
  if (charity.verificationCode !== token) {
    charity.verificationCode = null;
    charity = await charity.save();
    throw new UnauthenticatedError(
      'invalid token send request again to reset a password'
    );
  }
  charity.verificationCode = null;
  charity.password = req.body.password;
  await charity.save();
  await setupMailSender(
    req,
    'password changed alert',
    '<h3>contact us if you did not changed the password</h3>' +
      `<h3>go to link(www.dummy.com) to freeze your account</h3>`
  );

  res.status(201).json({ message: 'charity password changed successfully' });
});

const changePassword = asyncHandler(async (req, res, next) => {
  const { password } = req.body;
  const charity = await Charity.findById(req.charity._id);
  charity.password = password;
  console.log(charity instanceof Charity);
  await charity.save();
  await setupMailSender(
    req,
    'password changed alert',
    '<h3>contact us if you did not changed the password</h3>' +
      `<h3>go to link(www.dummy.com) to freeze your account</h3>`
  );

  res.status(201).json({ message: 'Charity password changed successfully' });
});
const showCharityProfile = asyncHandler(async (req, res, next) => {
  const charity = await Charity.findById(req.charity._id).select(
    '-_id -password -verificationCode -emailVerification -phoneVerification -isEnabled -isConfirmed -isPending'
  );
  if (!charity) throw new NotFoundError('charity not found');
  res.status(201).json({
    charity,
    message: 'charity Data retrieved Successfully',
  });
});

const editCharityProfileAdresses = asyncHandler(
  async (req, res, next, indx) => {
    const tempLocation = {}; // Create a tempLocation object
    const { governorate, city, street } = { ...req.body.location[0] };
    if (indx !== -1) {
      console.log(req.body.location[0]);
      if (governorate) {
        // req.charity.location[indx].governorate = governorate;
        tempLocation.governorate = governorate;
      }
      console.log(city === ''); //true
      console.log(city === true); //false
      if (city) {
        // req.charity.location[indx].city = city;
        tempLocation.city = city;
      }
      if (street) {
        // req.charity.location[indx].street = street;
        tempLocation.street = street;
      }
      req.charity.location[indx] = tempLocation; //assign the object
      await req.charity.save();
      return res.json(req.charity.location[indx]);
    } else if (indx === -1 && (governorate || city || street)) {
      //add a new address

      if (governorate) {
        tempLocation.governorate = governorate;
      }
      if (city) {
        tempLocation.city = city;
      }
      if (street) {
        tempLocation.street = street;
      }
      req.charity.location.push(tempLocation); // Push the tempLocation object into the array
      await req.charity.save(); // Save the charity document
      const len = req.charity.location.length - 1;
      return res.json(req.charity.location[len]);
    }
  }
);
const editCharityProfile = asyncHandler(async (req, res, next) => {
  console.log('editCharityProfile');
  // console.log(req.body);
  
  const { location, currency, image, email } = req.body;
  if (email) {
    const alreadyRegisteredEmail = await Charity.findOne({ email });
    if (alreadyRegisteredEmail) {
      throw new BadRequestError('Email is already taken!');
    } else {
      req.charity.email = email;
      req.charity.emailVerification.isVerified = false;
      req.charity.emailVerification.verificationDate = null;
      const token = await generateResetTokenTemp();
      req.charity.verificationCode = token;
      await req.charity.save()
      await setupMailSender(
        req,
        'email changed alert',
        'email has been changed You must Re activate account ' +
          `<h3>(www.activate.com)</h3>` +
          `<h3>use that token to confirm the new password</h3> <h2>${token}</h2>`
      );
      return res.status(201).json({
        _id: req.charity._id,
        name: req.charity.name,
        email: req.charity.email,
        image: req.charity.image,
        message: 'Email Changed Successfully,But you must Re Activate the account with the token sent to your email'// to access editing your other information again',
      });
    }
  }
  let charity = await Charity.findById(req.charity._id);
  // if (image) {
  //   console.log('img');
  //   uploadCoverImage(req, res, next);
  //   await resizeImg(req, res, next);
  // }
  // if (currency) throw new BadRequestError('cant change currency at this time');
  if (location) {
    //for editing location
    let indx = req.charity.location.findIndex(
      (location) => location._id.toString() === req.body.location_id
    );
    return await editCharityProfileAdresses(req, res, next, indx);
  }
  if (currency) {
    //editing currency
    console.log(currency[0]);
    let indx = req.charity.currency.find((it) => {
      console.log(it);
      if (it === currency[0]) {
        return res.json({ message: 'currency is exist' });
      }
    });
    req.charity.currency.push(currency[0]);
    await req.charity.save();
    const len = req.charity.currency.length - 1;
    return res.json(req.charity.currency[len]);
  }

  if (!charity) throw new NotFoundError('charity not found');
  for (const [key, valueObj] of Object.entries(req.body)) {
    if (key === 'paymentMethods' || key.split('.')[0] === 'paymentMethods')
      throw new BadRequestError(
        'Cant edit it,You must request to Change payment account or Add a new one'
      );
    if (key === 'charityDocs' || key.split('.')[0] === 'charityDocs')
      throw new BadRequestError('Cant edit it,You must contact us');
  }
  if (image) {
    console.log('old img');
    //to delete the old image locally
    console.log(req.charity.image); //old image profile
    const oldImagePath = path.join('./uploads/LogoCharities', req.charity.image);
    if (fs.existsSync(oldImagePath)) {
      // Delete the file
      fs.unlinkSync(oldImagePath);
      console.log('Old image deleted successfully.');
    } else {
      console.log('Old image does not exist.');
    }
    console.log('new img');

    console.log(image); //new img profile
  }
  const updateCharityArgs = dot.dot(req.body);
  // if (updateCharityArgs.image) {
  //   delete updateCharityArgs.image
  // }
  charity = await Charity.findByIdAndUpdate(
    req.charity._id,
    {
      $set: {
        ...updateCharityArgs,
      },
    },
    { new: true } // return the updated document after the changes have been applied.
    );
  await charity.save();
  res.status(201).json({
    _id: charity._id,
    name: charity.name,
    email: charity.email,
    image: charity.image,
    message: 'charity Data Changed Successfully',
  });
});

const editCharityProfilePaymentMethods = asyncHandler(
  async (req, res, next, indx, selector) => {
    const temp = {}; // Create a tempLocation object
    // temp.docsBank=[]
    if (selector === 'bankAccount') {
      const { accNumber, iban, swiftCode } =
        req.body.paymentMethods.bankAccount[0];
        const  docsBank  = req.body.paymentMethods.bankAccount.docsBank[0];

      console.log(accNumber);
      console.log(iban);
      console.log(swiftCode);
      temp.accNumber = accNumber;
      temp.iban = iban;
      temp.swiftCode = swiftCode;
      temp.docsBank=docsBank
    } else if (selector === 'fawry') {
      const { number } = req.body.paymentMethods.fawry[0];
      const docsFawry= req.body.paymentMethods.fawry.docsFawry[0];

      console.log(number);
      temp.number = number;
      temp.docsFawry = docsFawry;
    } else if (selector === 'vodafoneCash') {
      const { number } = req.body.paymentMethods.vodafoneCash[0];
      const  docsVodafoneCash = req.body.paymentMethods.vodafoneCash.docsVodafoneCash[0];
      temp.number = number;
      temp.docsVodafoneCash = docsVodafoneCash;
    }
    if (indx !== -1) {//edit a payment account && enable attribute will be reset to false again
      if (selector === 'bankAccount') {
        req.charity.paymentMethods.bankAccount[indx].accNumber = temp.accNumber; //assign the object
        req.charity.paymentMethods.bankAccount[indx].iban = temp.iban; //assign the object
        req.charity.paymentMethods.bankAccount[indx].swiftCode = temp.swiftCode; //assign the object
        req.charity.paymentMethods.bankAccount[indx].docsBank = [temp.docsBank]
        req.charity.paymentMethods.bankAccount[indx].enable=false//reset again to review it again
        // req.charity.modifyPaymentMethodsRequest = true;

        await req.charity.save();
        return res.json(req.charity.paymentMethods.bankAccount[indx]);
      } else if (selector === 'fawry') {
        req.charity.paymentMethods.fawry[indx].number = temp.number; //assign the object
        req.charity.paymentMethods.fawry[indx].docsFawry = temp.docsFawry
        req.charity.paymentMethods.fawry[indx].enable=false//reset again to review it again
        // req.charity.modifyPaymentMethodsRequest = true;

        await req.charity.save();
        return res.json(req.charity.paymentMethods.fawry[indx]);
      } else if (selector === 'vodafoneCash') {
        req.charity.paymentMethods.vodafoneCash[indx].number = temp.number; //assign the object
        req.charity.paymentMethods.vodafoneCash[indx].docsVodafoneCash = temp.docsVodafoneCash
        req.charity.paymentMethods.vodafoneCash[indx].enable=false//reset again to review it again
        // req.charity.modifyPaymentMethodsRequest = true;

        await req.charity.save();
        return res.json(req.charity.paymentMethods.vodafoneCash[indx]);
      }
    } else if (indx === -1) {//add a new payment account
      //add a new address
      if (selector === 'bankAccount') {
        // const { docsVodafoneCash} = req.body.paymentMethods.docsVodafoneCash[0];
        // req.charity.paymentMethods.vodafoneCash[indx].docsVodafoneCash=docsVodafoneCash
        req.charity.paymentMethods.bankAccount.push(temp); //assign the object
        // req.charity.modifyPaymentMethodsRequest = true;

        await req.charity.save();
        const len = req.charity.paymentMethods.bankAccount.length - 1;
        return res.json(req.charity.paymentMethods.bankAccount[len]);
      } else if (selector === 'fawry') {
        req.charity.paymentMethods.fawry.push(temp); //assign the object
        // req.charity.modifyPaymentMethodsRequest = true;

        await req.charity.save();
        const len = req.charity.paymentMethods.fawry.length - 1;
        return res.json(req.charity.paymentMethods.fawry[len]);
      } else if (selector === 'vodafoneCash') {
        req.charity.paymentMethods.vodafoneCash.push(temp); //assign the object
        // req.charity.modifyPaymentMethodsRequest = true;

        await req.charity.save();
        const len = req.charity.paymentMethods.vodafoneCash.length - 1;
        return res.json(req.charity.paymentMethods.vodafoneCash[len]);
      }
    }
  }
);
const requestEditCharityProfilePayments = asyncHandler(
  async (req, res, next) => {
    if (!req.body.paymentMethods) {
      deleteOldImgs(req, res, next);
      throw new BadRequestError('you must upload complete data to be sent');
    }
    const { bankAccount, fawry, vodafoneCash } = req.body.paymentMethods;
    // 1-> bankAccount
    // console.log(bankAccount[0]);
    // console.log(req.body.paymentMethods);
    if (bankAccount) {
      let indx = req.charity.paymentMethods.bankAccount.findIndex(
        (paymentMethods) =>
          paymentMethods._id.toString() === req.body.payment_id
      );
      console.log('indx=' + indx);

      return await editCharityProfilePaymentMethods(
        req,
        res,
        next,
        indx,
        'bankAccount'
      );
    } else if (fawry) {
      console.log('ff');
      let indx = req.charity.paymentMethods.fawry.findIndex(
        (paymentMethods) =>
          paymentMethods._id.toString() === req.body.payment_id
      );
      console.log('indx=' + indx);
      return await editCharityProfilePaymentMethods(
        req,
        res,
        next,
        indx,
        'fawry'
      );
    } else if (vodafoneCash) {
      let indx = req.charity.paymentMethods.vodafoneCash.findIndex(
        (paymentMethods) =>
          paymentMethods._id.toString() === req.body.payment_id
      );
      console.log('indx=' + indx);
      return await editCharityProfilePaymentMethods(
        req,
        res,
        next,
        indx,
        'vodafoneCash'
      );
    }
    // console.log(req);
    // console.log(req.body);
    // for (const [key, valueObj] of Object.entries(req.body)) {

    //   console.log('--');
    //   console.log(key);
    //   console.log(valueObj);
    //   if (typeof valueObj === 'object') {
    //     for (const [subKey, val] of Object.entries(valueObj)) {
    //       if (!isNaN(subKey)) {
    //         console.log('arr of objects'); //for location
    //         charity[key][subKey] = { val };
    //       } else {
    //         console.log('an obj');
    //       }

    //       // console.log(typeof subKey);
    //       console.log(val);
    //       charity[key][subKey] = val;
    //     }
    //   } else {
    //     // If the value is not an object, assign it directly
    //     charity[key] = valueObj;
    //   }
    // }
    res.json(req.body);
  }
);
const deleteOldImgs = (req, res, next) => {
  req.temp.map(async (img) => {
    const oldImagePath = path.join('./uploads/docsCharities', img);
    if (fs.existsSync(oldImagePath)) {
      // Delete the file
      fs.unlinkSync(oldImagePath);
      console.log('Old image deleted successfully.');
    } else {
      console.log('Old image does not exist.');
    }
  });
  req.temp = [];
};

const addCharityPayments = asyncHandler(async (req, res, next) => {
  if (!req.body.paymentMethods) {
    deleteOldImgs(req, res, next);
    throw new BadRequestError(
      'must send one of payment gateways inforamtions..'
    );
  }
  const { bankAccount, fawry, vodafoneCash } = req.body.paymentMethods;

  if (req.charity.paymentMethods === undefined) req.charity.paymentMethods = {};

  console.log('-------------------');
  if (bankAccount) {
    const { accNumber, iban, swiftCode } = bankAccount[0];
    let docsBank = bankAccount.docsBank[0];
    let temp = {
      accNumber,
      iban,
      swiftCode,
      docsBank,
    };
    // console.log(temp);
    if (accNumber && iban && swiftCode && docsBank) {
      req.charity.paymentMethods['bankAccount'].push(temp);
    } else {
      console.log(req.temp);
      deleteOldImgs(req, res, next);
      throw new BadRequestError('must provide complete information');
    }
    // console.log(req.charity.paymentMethods);
  }
  if (fawry) {
    const { number } = fawry[0];
    let docsFawry = fawry.docsFawry[0];

    if (number && docsFawry) {
      const temp = {
        number,
        docsFawry,
      };
      req.charity.paymentMethods['fawry'].push(temp);
    } else {
      deleteOldImgs(req, res, next);

      throw new BadRequestError('must provide complete information');
    }
  }
  if (vodafoneCash) {
    const { number } = vodafoneCash[0];
    let docsVodafoneCash = vodafoneCash.docsVodafoneCash[0];

    if (number && docsVodafoneCash) {
      const temp = {
        number,
        docsVodafoneCash,
      };

      req.charity.paymentMethods['vodafoneCash'].push(temp);
    } else {
      deleteOldImgs(req, res, next);
      throw new BadRequestError('must provide complete information');
    }
  }
  // await charity.save()
  await req.charity.save();

  // res.json(req.body);

  res.json(req.charity.paymentMethods);
});

const logout = asyncHandler((req, res, next) => {
  if (!req.cookies.jwt) throw new UnauthenticatedError('you are not logged in');

  res.cookie('jwt', '', {
    expires: new Date(0),
    httpOnly: true,
  });
  res.status(200).json({ message: 'Loggedout Successfully!' });
});

const sendDocs = asyncHandler(async (req, res, next) => {
  // console.log(req.body);
  // console.log('fsdfsadf');
  // Charity.schema.path('charityDocs').required(true)
  // await Charity.schema.save()

  // const charity = await Charity.findById(req.charity._id);
  // console.log(charity);
  if (!req.charity) {
    deleteOldImgs(req, res, next);
    throw new NotFoundError('No charity found ');
  
  }
  if (
    (req.charity.emailVerification.isVerified ||
      req.charity.phoneVerification.isVerified) &&
    !req.charity.isConfirmed &&
    !req.charity.isPending
  ) {
    req.charity.charityDocs = { ...req.body.charityDocs };
    console.log('---');
    // console.log(req.body.paymentMethods);
    // console.log({...req.body});
    req.charity.isPending = true;
    // await charity.save();
    next();
    // res.json([charity.charityDocs, { message: 'sent successfully' }]);
  } else if (
    !req.charity.emailVerification.isVerified &&
    !req.charity.phoneVerification.isVerified
  ) {
    deleteOldImgs(req, res, next);

    throw new UnauthenticatedError('you must verify your account again');
  } else if (req.charity.isConfirmed) {
    deleteOldImgs(req, res, next);

    throw new BadRequestError('you already has been confirmed');
  } else if (req.charity.isPending) {
    deleteOldImgs(req, res, next);

    throw new BadRequestError('soon response... still reviewing docs');
  } else {
    deleteOldImgs(req, res, next);

    throw new BadRequestError('error occured, try again later');
  }
});
export {
  registerCharity,
  authCharity,
  activateCharityAccount,
  requestResetPassword,
  confirmResetPasswordRequest,
  changePassword,
  logout,
  sendDocs,
  editCharityProfile,
  showCharityProfile,
  requestEditCharityProfilePayments,
  addCharityPayments,
};

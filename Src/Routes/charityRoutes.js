import express, { Router } from 'express';
import {
  registerCharity,
  uploadCoverImage,
} from '../Controllers/charityController.js';

const router = express.Router();

router.post('/', uploadCoverImage, registerCharity);

export default router;

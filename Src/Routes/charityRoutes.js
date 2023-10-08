import express, { Router } from 'express';

import { registerCharity } from '../Controllers/charityController.js';
const router = express.Router();

router.post('/',registerCharity);

export default router;
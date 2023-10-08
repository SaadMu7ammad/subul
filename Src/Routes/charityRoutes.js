import express, { Router } from 'express';

import { registerCharity } from '../controllers/charityController.js';

const router = express.Router();

router.post('/',registerCharity);

export default router;
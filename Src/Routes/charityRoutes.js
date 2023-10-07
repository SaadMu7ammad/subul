import express, { Router } from 'express';

import { registerCharity } from '../controllers/charity.js';

const router = express.Router();

router.post('/',registerCharity);

export default router;
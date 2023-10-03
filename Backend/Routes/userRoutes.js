import express, { Router } from 'express'

const router = express.Router()
import {authUser,registerUser,logoutUser} from '../Controllers/userController.js'
import { auth } from '../middlewares/authMiddleware.js'
router.post('/', registerUser)
router.post('/auth', authUser)
router.post('/logout', logoutUser)

export default router



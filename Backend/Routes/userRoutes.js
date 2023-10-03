import express, { Router } from 'express'

const router = express.Router()
import {authUser,registerUser,logoutUser,getUserProfile,updateUserProfile} from '../Controllers/userController.js'
import { auth } from '../middlewares/authMiddleware.js'
router.post('/', registerUser)
router.post('/auth', authUser)
router.post('/logout', logoutUser)
router.route('/profile').get(auth,getUserProfile).put(auth,updateUserProfile)

export default router



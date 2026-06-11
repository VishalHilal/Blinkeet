import { Router } from 'express'
import auth from '../middleware/auth.js'
import superAdminAuth from '../middleware/superAdminAuth.js'
import { getAllUsers, getAllOrders, updateUserRole } from '../controllers/superAdminController.js'

const superAdminRouter = Router()

// All routes require: valid login token + SUPERADMIN role
superAdminRouter.get('/users', auth, superAdminAuth, getAllUsers)
superAdminRouter.get('/orders', auth, superAdminAuth, getAllOrders)
superAdminRouter.put('/update-role', auth, superAdminAuth, updateUserRole)

export default superAdminRouter

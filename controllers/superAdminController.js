import UserModel from '../models/userModel.js'
import OrderModel from '../models/orderModel.js'

// GET /api/superadmin/users
export async function getAllUsers(request, response) {
    try {
        const users = await UserModel.find()
            .select('-password -refresh_token -forgot_password_otp')
            .sort({ createdAt: -1 })

        return response.json({
            message: 'All users fetched successfully',
            data: users,
            error: false,
            success: true
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// GET /api/superadmin/orders
export async function getAllOrders(request, response) {
    try {
        const orders = await OrderModel.find()
            .populate('userId', 'name email mobile')
            .populate('delivery_address')
            .sort({ createdAt: -1 })

        return response.json({
            message: 'All orders fetched successfully',
            data: orders,
            error: false,
            success: true
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// PUT /api/superadmin/update-role
export async function updateUserRole(request, response) {
    try {
        const { userId, role } = request.body

        if (!userId || !role) {
            return response.status(400).json({
                message: 'userId and role are required',
                error: true,
                success: false
            })
        }

        const validRoles = ['SUPERADMIN', 'ADMIN', 'USER']
        if (!validRoles.includes(role)) {
            return response.status(400).json({
                message: 'Invalid role. Must be SUPERADMIN, ADMIN, or USER',
                error: true,
                success: false
            })
        }

        const updated = await UserModel.findByIdAndUpdate(
            userId,
            { role },
            { new: true }
        ).select('-password -refresh_token')

        if (!updated) {
            return response.status(404).json({
                message: 'User not found',
                error: true,
                success: false
            })
        }

        return response.json({
            message: `Role updated to ${role} successfully`,
            data: updated,
            error: false,
            success: true
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

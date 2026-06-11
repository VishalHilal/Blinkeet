import UserModel from '../models/userModel.js'
import OrderModel from '../models/orderModel.js'
import CartModel from '../models/cartproductModel.js'
import AddressModel from '../models/addressModel.js'

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

// DELETE /api/superadmin/delete-user/:id
export async function deleteUser(request, response) {
    try {
        const { id } = request.params
        const requestingUserId = request.userId

        // Prevent self-deletion
        if (id === requestingUserId) {
            return response.status(400).json({
                message: 'You cannot delete your own account',
                error: true,
                success: false
            })
        }

        const userToDelete = await UserModel.findById(id)

        if (!userToDelete) {
            return response.status(404).json({
                message: 'User not found',
                error: true,
                success: false
            })
        }

        // Prevent deleting another superadmin
        if (userToDelete.role === 'SUPERADMIN') {
            return response.status(403).json({
                message: 'Cannot delete another superadmin account',
                error: true,
                success: false
            })
        }

        // Clean up related data
        await CartModel.deleteMany({ userId: id })
        await AddressModel.deleteMany({ userId: id })

        // Delete the user
        await UserModel.findByIdAndDelete(id)

        return response.json({
            message: `User "${userToDelete.name}" deleted successfully`,
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

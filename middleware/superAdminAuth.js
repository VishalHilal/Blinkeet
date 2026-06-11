import UserModel from '../models/userModel.js'

const superAdminAuth = async (request, response, next) => {
    try {
        const userId = request.userId // set by auth middleware

        const user = await UserModel.findById(userId).select('role')

        if (!user || user.role !== 'SUPERADMIN') {
            return response.status(403).json({
                message: 'Access denied. Superadmin only.',
                error: true,
                success: false
            })
        }

        next()
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export default superAdminAuth

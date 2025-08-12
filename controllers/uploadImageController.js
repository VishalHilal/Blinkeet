import uploadImageCloudinary from "../utils/uploadImageCloudinary.js"

const uploadImageController = async(request, response) => {
    try {
        const file = request.file
        if (!file) {
            return response.status(400).json({
                message: "No file uploaded",
                error: true,
                success: false
            })
        }

        const name = request.body.name || ''
        console.log('Uploading file with name:', name)

        const uploadResult = await uploadImageCloudinary(file, name)
        console.log('Upload result:', uploadResult)

        if (!uploadResult || !uploadResult.url) {
            throw new Error('Failed to upload image to Cloudinary')
        }

        return response.json({
            message: "Upload successful",
            data: uploadResult,
            success: true,
            error: false
        })
    } catch (error) {
        console.error('Upload error:', error)
        return response.status(500).json({
            message: error.message || "Failed to upload image",
            error: true,
            success: false
        })
    }
}

export default uploadImageController
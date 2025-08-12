import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET_KEY
})

const uploadImageCloudinary = async(image, name = '') => {
    try {
        if (!image) {
            throw new Error('No image provided')
        }

        const buffer = image?.buffer || Buffer.from(await image.arrayBuffer())
        const timestamp = Date.now()

        // Create a Cloudinary-safe filename
        // Replace all special characters and spaces with underscores
        const safeName = name
            ? name
                .toLowerCase()
                .replace(/[^a-z0-9]/g, '_') // Replace any non-alphanumeric with underscore
                .replace(/_+/g, '_')        // Replace multiple underscores with single underscore
                .replace(/^_|_$/g, '')      // Remove leading/trailing underscores
                + '_' + timestamp
            : `image_${timestamp}`

        console.log('Uploading with safe filename:', safeName)

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({
                folder: "blinkeet",
                public_id: safeName,
                resource_type: "auto",
                allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
                // Add more options to handle special characters
                transformation: [
                    { fetch_format: "auto" },
                    { quality: "auto" }
                ]
            }, (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error)
                    return reject(error)
                }
                return resolve(result)
            }).end(buffer)
        })

        if (!uploadResult || !uploadResult.url) {
            throw new Error('Failed to get upload URL from Cloudinary')
        }

        // Add the original name to the result for reference
        uploadResult.original_name = name

        console.log('Upload successful:', uploadResult.url)
        return uploadResult

    } catch (error) {
        console.error('Cloudinary upload error:', error)
        throw new Error(error.message || 'Failed to upload image to Cloudinary')
    }
}

export default uploadImageCloudinary

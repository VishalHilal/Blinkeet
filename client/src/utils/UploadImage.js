import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'

const uploadImage = async(image, name = '') => {
    try {
        const formData = new FormData()
        formData.append('image', image)
        if (name) {
            formData.append('name', name)
        }

        const response = await Axios({
            ...SummaryApi.uploadImage,
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        // Log the full response for debugging
        console.log('Upload response:', response)

        // If response is an error object, throw it
        if (response instanceof Error) {
            throw response
        }

        // If response doesn't have data, throw error
        if (!response?.data) {
            throw new Error('Invalid response from server')
        }

        return response
    } catch (error) {
        console.error('Upload error:', error)
        // If it's an axios error, return the response data
        if (error.response) {
            throw new Error(error.response.data?.message || 'Upload failed')
        }
        // Otherwise throw the error
        throw error
    }
}

export default uploadImage
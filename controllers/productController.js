import ProductModel from "../models/productModel.js";

export const createProductController = async(request,response)=>{
    try {
        const { 
            name ,
            image ,
            category,
            subCategory,
            unit,
            stock,
            price,
            discount,
            description,
            more_details,
        } = request.body 

        if(!name || !image[0] || !category[0] || !subCategory[0] || !unit || !price || !description ){
            return response.status(400).json({
                message : "Enter required fields to upload the product",
                error : true,
                success : false
            })
        }

        const product = new ProductModel({
            name ,
            image ,
            category,
            subCategory,
            unit,
            stock,
            price,
            discount,
            description,
            more_details,
        })
        const saveProduct = await product.save()

        return response.json({
            message : "Product Created Successfully",
            data : saveProduct,
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const getProductController = async(request,response)=>{
    try {
        let { page, limit, search } = request.body 

        if(!page){
            page = 1
        }

        if(!limit){
            limit = 10
        }

        // Only use text search if search string is not empty and has at least 2 characters
        const query = search && search.trim().length >= 2 ? {
            $text: {
                $search: search.trim()
            }
        } : {}

        const skip = (page - 1) * limit

        try {

            const totalProducts = await ProductModel.find();

            const productLength = totalProducts.length

            const [data, totalCount] = await Promise.all([
                ProductModel.find(query)
                    .sort(search ? { score: { $meta: "textScore" } } : { createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .populate('category subCategory'),
                ,ProductModel.countDocuments(query)
            ])


            return response.json({
                message: "Product data",
                error: false,
                success: true,
                totalCount: productLength,
                totalNoPage: Math.ceil(productLength / limit),
                data: data
            })
        } catch (dbError) {
            // If text search fails, fall back to regex search
            if (search && search.trim().length >= 2) {
                const regexQuery = {
                    $or: [
                        { name: { $regex: search.trim(), $options: 'i' } },
                        { description: { $regex: search.trim(), $options: 'i' } }
                    ]
                }
                
                const [data, totalCount] = await Promise.all([
                    ProductModel.find(regexQuery)
                        .sort({ createdAt: -1 })
                        .skip(skip)
                        .limit(limit)
                        .populate('category subCategory'),
                    ProductModel.countDocuments(regexQuery)
                ])

                return response.json({
                    message: "Product data",
                    error: false,
                    success: true,
                    totalCount: totalCount,
                    totalNoPage: Math.ceil(totalCount / limit),
                    data: data
                })
            }
            throw dbError
        }
    } catch (error) {
        console.error('Product search error:', error)
        return response.status(500).json({
            message: error.message || "Error searching products",
            error: true,
            success: false
        })
    }
}

export const getProductByCategory = async(request,response)=>{
    try {
        const { id } = request.body 

        if(!id){
            return response.status(400).json({
                message : "provide category id",
                error : true,
                success : false
            })
        }

        const product = await ProductModel.find({ 
            category : { $in : id }
        }).limit(15)

        return response.json({
            message : "category product list",
            data : product,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const getProductByCategoryAndSubCategory  = async(request,response)=>{
    try {
        const { categoryId,subCategoryId,page,limit } = request.body

        if(!categoryId || !subCategoryId){
            return response.status(400).json({
                message : "Provide categoryId and subCategoryId",
                error : true,
                success : false
            })
        }

        if(!page){
            page = 1
        }

        if(!limit){
            limit = 10
        }

        const query = {
            category : { $in :categoryId  },
            subCategory : { $in : subCategoryId }
        }

        const skip = (page - 1) * limit

        const [data,dataCount] = await Promise.all([
            ProductModel.find(query).sort({createdAt : -1 }).skip(skip).limit(limit),
            ProductModel.countDocuments(query)
        ])

        return response.json({
            message : "Product list",
            data : data,
            totalCount : dataCount,
            page : page,
            limit : limit,
            success : true,
            error : false
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const getProductDetails = async(request,response)=>{
    try {
        const { productId } = request.body 

        const product = await ProductModel.findOne({ _id : productId })


        return response.json({
            message : "product details",
            data : product,
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//update product
export const updateProductDetails = async(request,response)=>{
    try {
        const { _id } = request.body 

        if(!_id){
            return response.status(400).json({
                message : "provide product _id",
                error : true,
                success : false
            })
        }

        const updateProduct = await ProductModel.updateOne({ _id : _id },{
            ...request.body
        })

        return response.json({
            message : "updated successfully",
            data : updateProduct,
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//delete product
export const deleteProductDetails = async(request,response)=>{
    try {
        const { _id } = request.body 

        if(!_id){
            return response.status(400).json({
                message : "provide _id ",
                error : true,
                success : false
            })
        }

        const deleteProduct = await ProductModel.deleteOne({_id : _id })

        return response.json({
            message : "Delete successfully",
            error : false,
            success : true,
            data : deleteProduct
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//search product
export const searchProduct = async(request,response)=>{
    try {
        let { search, page, limit } = request.body 

        if(!page){
            page = 1
        }
        if(!limit){
            limit = 10
        }

        // Only use text search if search string is not empty and has at least 2 characters
        const searchString = search ? search.trim() : ''
        const isTextSearch = searchString.length >= 2
        const query = isTextSearch ? {
            $text: {
                $search: searchString
            }
        } : {}

        const skip = (page - 1) * limit

        try {
            const [data, dataCount] = await Promise.all([
                ProductModel.find(query)
                    .sort(isTextSearch ? { score: { $meta: "textScore" } } : { createdAt: -1 })
                    .select(isTextSearch ? { score: { $meta: "textScore" } } : {})
                    .skip(skip)
                    .limit(limit)
                    .populate('category subCategory'),
                ProductModel.countDocuments(query)
            ])

            return response.json({
                message: "Product data",
                error: false,
                success: true,
                data: data,
                totalCount: dataCount,
                totalPage: Math.ceil(dataCount/limit),
                page: page,
                limit: limit
            })
        } catch (dbError) {
            // If text search fails, fall back to regex search
            if (isTextSearch) {
                const regexQuery = {
                    $or: [
                        { name: { $regex: searchString, $options: 'i' } },
                        { description: { $regex: searchString, $options: 'i' } }
                    ]
                }
                
                const [data, dataCount] = await Promise.all([
                    ProductModel.find(regexQuery)
                        .sort({ createdAt: -1 })
                        .skip(skip)
                        .limit(limit)
                        .populate('category subCategory'),
                    ProductModel.countDocuments(regexQuery)
                ])

                return response.json({
                    message: "Product data",
                    error: false,
                    success: true,
                    data: data,
                    totalCount: dataCount,
                    totalPage: Math.ceil(dataCount/limit),
                    page: page,
                    limit: limit
                })
            }
            throw dbError
        }
    } catch (error) {
        console.error('Product search error:', error)
        return response.status(500).json({
            message: error.message || "Error searching products",
            error: true,
            success: false
        })
    }
}
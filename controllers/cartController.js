import CartProductModel from "../models/cartproductModel.js";
import UserModel from "../models/userModel.js";

export const addToCartItemController = async(request,response)=>{
    try {
        const  userId = request.userId
        const { productId } = request.body
        
        if(!productId){
            return response.status(402).json({
                message : "Provide productId",
                error : true,
                success : false
            })
        }

        const checkItemCart = await CartProductModel.findOne({
            userId : userId,
            productId : productId
        })

        if(checkItemCart){
            // If item already exists, increment quantity
            const updatedCartItem = await CartProductModel.findOneAndUpdate(
                { userId: userId, productId: productId },
                { $inc: { quantity: 1 } },
                { new: true }
            );

            return response.json({
                data : updatedCartItem,
                message : "Item quantity updated successfully",
                error : false,
                success : true
            })
        }

        const cartItem = new CartProductModel({
            quantity : 1,
            userId : userId,
            productId : productId
        })
        const save = await cartItem.save()

        const updateCartUser = await UserModel.updateOne({ _id : userId},{
            $push : { 
                shopping_cart : productId
            }
        })

        return response.json({
            data : save,
            message : "Item add successfully",
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

export const getCartItemController = async(request,response)=>{
    try {
        const userId = request.userId

        const cartItem =  await CartProductModel.find({
            userId : userId
        }).populate('productId')

        return response.json({
            data : cartItem,
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

export const updateCartItemQtyController = async(request,response)=>{
    try {
        const userId = request.userId 
        const { _id,qty } = request.body

        if(!_id ||  !qty){
            return response.status(400).json({
                message : "provide _id, qty"
            })
        }

        const updateCartitem = await CartProductModel.updateOne({
            _id : _id,
            userId : userId
        },{
            quantity : qty
        })

        return response.json({
            message : "Update cart",
            success : true,
            error : false, 
            data : updateCartitem
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const deleteCartItemQtyController = async(request,response)=>{
    try {
        const userId = request.userId
        const { _id, clearAll } = request.body

        if (clearAll) {
            // Clear all cart items for the user
            await CartProductModel.deleteMany({ userId: userId });
            await UserModel.updateOne(
                { _id: userId },
                { $set: { shopping_cart: [] } }
            );

            return response.json({
                message: "Cart cleared successfully",
                error: false,
                success: true
            });
        }

        if(!_id){
            return response.status(402).json({
                message : "Provide cart item id",
                error : true,
                success : false
            })
        }

        const deleteCartItem = await CartProductModel.deleteOne({
            _id : _id,
            userId : userId
        })

        if(deleteCartItem.deletedCount === 0){
            return response.status(400).json({
                message : "Cart item not found",
                error : true,
                success : false
            })
        }

        const updateUserCart = await UserModel.updateOne(
            { _id : userId },
            { $pull : { shopping_cart : _id }}
        )

        return response.json({
            message : "Cart item deleted successfully",
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

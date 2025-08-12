import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart: [], // server cart for logged-in users
    guestCart: [] // local cart for guests
};

const saveGuestCartToStorage = (cart) => {
    try {
        localStorage.setItem('guestCart', JSON.stringify(cart));
    } catch {}
};

const loadGuestCartFromStorage = () => {
    try {
        const data = localStorage.getItem('guestCart');
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

const cartSlice = createSlice({
    name: "cartItem",
    initialState: {
        ...initialState,
        guestCart: loadGuestCartFromStorage() // Initialize guest cart from localStorage
    },
    reducers: {
        handleAddItemCart: (state, action) => {
            state.cart = [...action.payload];
        },
        // Guest cart actions
        addGuestCartItem: (state, action) => {
            const existingItem = state.guestCart.find(item => item._id === action.payload._id);
            if (existingItem) {
                // If item exists, increment quantity
                existingItem.quantity += 1;
            } else {
                // If item doesn't exist, add it with quantity 1
                state.guestCart.push({ ...action.payload, quantity: 1 });
            }
            saveGuestCartToStorage(state.guestCart);
        },
        removeGuestCartItem: (state, action) => {
            state.guestCart = state.guestCart.filter(item => item._id !== action.payload);
            saveGuestCartToStorage(state.guestCart);
        },
        updateGuestCartItemQty: (state, action) => {
            const { _id, quantity } = action.payload;
            const item = state.guestCart.find(item => item._id === _id);
            if (item) {
                item.quantity = quantity;
                saveGuestCartToStorage(state.guestCart);
            }
        },
        clearGuestCart: (state) => {
            state.guestCart = [];
            saveGuestCartToStorage([]);
        },
        clearUserCart:(state) =>{
            state.cart = [];
        },
        initializeGuestCartFromStorage: (state) => {
            state.guestCart = loadGuestCartFromStorage();
        }
    }
});

export const {
    handleAddItemCart,
    addGuestCartItem,
    removeGuestCartItem,
    updateGuestCartItemQty,
    clearGuestCart,
    clearUserCart,
    initializeGuestCartFromStorage
} = cartSlice.actions;

export default cartSlice.reducer;
// src/store/cartSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, CartState } from "../assets/globals/types/cartTypes";
import { Status } from "../assets/globals/types/types";
import type { AppDispatch } from "./store";
import APIWITHTOKEN from "../http/APIWITHTOKEN";

const initialState: CartState = {
  items: [],
  status: Status.IDLE, // better default than LOADING
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },
    setStatus(state, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
    setClearCart(state) {
      state.items = [];
    },
  },
});

export const { setItems, setStatus, setClearCart } = cartSlice.actions;
export default cartSlice.reducer;

// ----------------------
// ✅ THUNKS
// ----------------------

export const fetchCartItems = () => async (dispatch: AppDispatch) => {
  dispatch(setStatus(Status.LOADING));
  try {
    const response = await APIWITHTOKEN.get("customer/cart");
    if (response.status === 200) {
      dispatch(setItems(response.data.data));
      dispatch(setStatus(Status.SUCCESS));
    } else {
      dispatch(setStatus(Status.ERROR));
    }
  } catch {
    dispatch(setStatus(Status.ERROR));
  }
};

export const addToCart = (productId: string) => async (dispatch: AppDispatch) => {
  dispatch(setStatus(Status.LOADING));
  try {
    const response = await APIWITHTOKEN.post("customer/cart", {
      productId,
      quantity: 1,
    });

    if (response.status === 200) {
      // directly update instead of refetch
      dispatch(setItems(response.data.data));
      dispatch(setStatus(Status.SUCCESS));
    } else {
      dispatch(setStatus(Status.ERROR));
    }
  } catch {
    dispatch(setStatus(Status.ERROR));
  }
};

export const deleteCartItem = (productId: string) => async (dispatch: AppDispatch, getState: any) => {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIWITHTOKEN.delete(`customer/cart/${productId}`);
      if (response.status === 200) {
        // Directly remove item from Redux store
        const currentItems: CartItem[] = getState().carts.items;
        const updatedItems = currentItems.filter(item => item.Product.id !== productId);
        dispatch(setItems(updatedItems));
        dispatch(setStatus(Status.SUCCESS));
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch {
      dispatch(setStatus(Status.ERROR));
    }
  };
  

  export const updateCartItem = (productId: string, quantity: number) => async (dispatch: AppDispatch, getState: any) => {
    if (quantity < 1) return;
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIWITHTOKEN.patch(`customer/cart/${productId}`, { quantity });
      if (response.status === 200) {
        // Directly update quantity in Redux
        const currentItems: CartItem[] = getState().carts.items;
        const updatedItems = currentItems.map(item => 
          item.Product.id === productId ? { ...item, quantity } : item
        );
        dispatch(setItems(updatedItems));
        dispatch(setStatus(Status.SUCCESS));
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch {
      dispatch(setStatus(Status.ERROR));
    }
  };
  

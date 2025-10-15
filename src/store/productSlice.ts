import {createSlice, type PayloadAction} from '@reduxjs/toolkit'
import type { Product, ProductState } from '../assets/globals/types/productTypes'
import { Status } from '../assets/globals/types/types'
import type { AppDispatch, RootState } from './store'
import API from '../http'


const initialState:ProductState = {
    product: [],
    status : Status.LOADING,
    singleProduct : null
}
const ProductSlice = createSlice({
    name : 'product',
    initialState,
    reducers :{
        setProduct(state:ProductState,action:PayloadAction<Product[]>){
            state.product = action.payload
        },
        setStatus(state:ProductState,action:PayloadAction<Status>){
            state.status = action.payload
        },
        setSingleProduct(state:ProductState,action:PayloadAction<Product>){
            state.singleProduct = action.payload
        },
        setUpdateProduct(state:ProductState,action:PayloadAction<Product>){
            const index = state.product.findIndex((prod)=>prod.id === action.payload.id)
            if(index !== -1){
                state.product[index] = action.payload
            }
        }
    }
})

export const {setProduct,setStatus,setSingleProduct,setUpdateProduct} = ProductSlice.actions
export default ProductSlice.reducer


export function fetchProducts(){
    return async function fetchProductsThunk(dispatch:AppDispatch){
        dispatch(setStatus(Status.LOADING))
        try{
            const response = await API.get('admin/product')
            if(response.status == 200){
                const {data} = response.data
                dispatch(setStatus(Status.SUCCESS))
                dispatch(setProduct(data))
            }else{
                dispatch(setStatus(Status.ERROR))
            }
        }catch(error){
            dispatch(setStatus(Status.ERROR))
        }

    }
}

export function fetchByProductId(productId:string){
    return async function fetchByProductIdThunk(dispatch:AppDispatch, getState:()=>RootState){
        const state = getState()
        const existingProduct = state.product.product.find((product:Product)=> product.id === productId)
        if(existingProduct){
            dispatch(setSingleProduct(existingProduct))
            dispatch(setStatus(Status.SUCCESS))
        }else{
            dispatch(setStatus(Status.LOADING))
            try{
                const response = await API.get(`admin/product/${productId}`)
                if(response.status == 200){
                    const {data} = response.data
                    dispatch(setStatus(Status.SUCCESS))
                    dispatch(setSingleProduct(data))
                }else{
                    dispatch(setStatus(Status.ERROR))
                }
            }catch(error){
                dispatch(setStatus(Status.ERROR))
            }
        }
    }
}

export function updateProductByProductId(productId:string){
    return async function updateProductByProductId(dispatch:AppDispatch, getState:()=>RootState){
        const state = getState()
        const existingProduct = state.product.product.find((product:Product)=> product.id === productId)
        if(existingProduct){
            dispatch(setSingleProduct(existingProduct))
            dispatch(setStatus(Status.SUCCESS))
        }else{
            dispatch(setStatus(Status.LOADING))
            try{
                const response = await API.get(`admin/product/${productId}`)
                if(response.status == 200){
                    const {data} = response.data
                    dispatch(setStatus(Status.SUCCESS))
                    dispatch(setSingleProduct(data))
                }else{
                    dispatch(setStatus(Status.ERROR))
                }
            }catch(error){
                dispatch(setStatus(Status.ERROR))
            }
        }
    }
}
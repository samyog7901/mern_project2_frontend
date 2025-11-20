import {createSlice, type PayloadAction} from '@reduxjs/toolkit'
import { Status } from '../assets/globals/types/types'
import type { AppDispatch } from './store'
import API from '../http'
import type { CategoryState } from '../assets/globals/types/categoryTypes'
import type { Category } from '../assets/globals/types/productTypes'


const initialState:CategoryState = {
    category: [],
    status : Status.LOADING
   
}
const categorySlice = createSlice({
    name : 'category',
    initialState,
    reducers :{
        setCategory(state:CategoryState,action:PayloadAction<Category[]>){
            state.category = action.payload
        },
        setStatus(state:CategoryState,action:PayloadAction<Status>){
            state.status = action.payload
        },
       
    }
})

export const {setCategory,setStatus} = categorySlice.actions
export default categorySlice.reducer


export function fetchCategories(){
    return async function fetchCategoriesThunk(dispatch:AppDispatch){
        dispatch(setStatus(Status.LOADING))
        try{
            const response = await API.get('admin/category')
            if(response.status == 200){
               
                dispatch(setStatus(Status.SUCCESS))
                dispatch(setCategory(response.data.data))
            }else{
                dispatch(setStatus(Status.ERROR))
            }
        }catch(error){
            dispatch(setStatus(Status.ERROR))
        }

    }
}




import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import API from "../http"
import { Status } from "../assets/globals/types/types"
import type { AppDispatch } from "./store"

// Types
export interface RegisterData {
  username: string
  email: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

export interface User {
  username: string
  email: string
  password?: string
  token: string
  role?: string
}

interface AuthState {
  user: User | null
  status: Status
}

// Initial state
const initialState: AuthState = {
  user: null,
  status: Status.LOADING, // ✅ cleaner default than loading
}

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload
    },
    setStatus(state, action: PayloadAction<Status>) {
      state.status = action.payload
    },
    resetStatus(state) {
      state.status = Status.LOADING
      state.user = null
    }
  }
})

export const { setUser, setStatus, resetStatus } = authSlice.actions
export default authSlice.reducer

// Thunks
export function register(data: RegisterData) {
  return async function registerThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING))
    try {
      const response = await API.post("register", data)
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS))
      } else {
        dispatch(setStatus(Status.ERROR))
      }
    } catch {
      dispatch(setStatus(Status.ERROR))
    }
  }
}

export function login(data: LoginData) {
  return async function loginThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING))
    try {
      const response = await API.post("login", data)
      if (response.status === 200) {
        const { user, token } = response.data.data
        const fullUser: User = { ...user, token }

        dispatch(setUser(fullUser))
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(fullUser))

        dispatch(setStatus(Status.SUCCESS))
      } else {
        dispatch(setStatus(Status.ERROR))
      }
    } catch {
      dispatch(setStatus(Status.ERROR))
    }
  }
}

export function logout() {
  return function logoutThunk(dispatch: AppDispatch) {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    dispatch(resetStatus())
  }
}

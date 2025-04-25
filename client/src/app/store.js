import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/userSlice"

export const store = configureStore({
    reducer: {
        userSlice: authSlice
    }
})
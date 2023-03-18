import { configureStore } from '@reduxjs/toolkit'
import colorModeReducer from '../features/colorModeSlice'
import { apiSlice } from './api/apiSlice'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import authReducer from '../features/auth/authSlice'

export const store = configureStore({
	reducer: {
		colorMode: colorModeReducer,
		[apiSlice.reducerPath]: apiSlice.reducer,
		auth: authReducer
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
	devTools: true
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch //usage?

setupListeners(store.dispatch)

import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'

interface AuthState {
	token: null | string
}

const authSlice = createSlice({
	name: 'auth',
	initialState: { token: null } as AuthState,
	reducers: {
		setCredentials: (state, action) => {
			// console.log('set credentials: ', action);
			const { accessToken } = action.payload

			state.token = accessToken
		},
		logOut: (state, action) => {
			state.token = null
		}
	}
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state: RootState) => state.auth.token

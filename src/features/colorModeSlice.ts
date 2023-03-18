import { createSlice } from '@reduxjs/toolkit'

interface ColorModeState {
	mode: 'light' | 'dark'
}

const initialState: ColorModeState = { mode: 'dark' }

export const colorModeSlice = createSlice({
	name: 'colorMode',
	initialState,
	reducers: {
		setMode: (state) => {
			state.mode = state.mode === 'light' ? 'dark' : 'light'
		}
	}
})

export const { setMode } = colorModeSlice.actions

export default colorModeSlice.reducer

import { PaletteMode } from '@mui/material'

// theme colors
const themeColorArr = ['#104c91', '#efc9af', '#1f8ac0'] // Terra Navy

export const darkColors = {
    secondary: {
        main: '#104c91',
        light: '#1f8ac0',
        dark: '#082548',
        contrastText: '#d9dbe9',
    },
    primary: {
        main: '#EFC9AF',
        light: '#fffce1',
        dark: '#bc9880',
        contrastText: '#2e2c34',
    },
    background: {
        paper: '#24263a',
        default: '#14142B',
    },
    custom: { highlight: '#3b3a54' },
    text: {
        primary: '#d9dbe9',
        secondary: '#2e2c34',
    },
}
export const lightColors = {
    primary: {
        main: '#104c91',
        light: '#1f8ac0',
        dark: '#082548',
        contrastText: '#d9dbe9',
    },
    secondary: {
        main: '#EFC9AF',
        light: '#fffce1',
        dark: '#bc9880',
        contrastText: '#2e2c34',
    },
    background: {
        paper: '#ffffff',
        default: '#eff0f7',
    },
    custom: { highlight: '#EAF3F8' },
    text: {
        primary: '#2e2c34',
        secondary: '#d9dbe9',
    },
}

// mui theme settings
export const themeSettings = (mode: PaletteMode) => ({
    palette: {
        mode: mode,
        ...(mode === 'dark' ? darkColors : lightColors),
    },
    typography: {
        fontFamily: ['Nunito', 'sans-serif'].join(','),
        fontSize: 12,
        h1: {
            fontFamily: ['Nunito', 'sans-serif'].join(','),
            fontSize: 40,
        },
        h2: {
            fontFamily: ['Nunito', 'sans-serif'].join(','),
            fontSize: 32,
        },
        h3: {
            fontFamily: ['Nunito', 'sans-serif'].join(','),
            fontSize: 24,
        },
        h4: {
            fontFamily: ['Nunito', 'sans-serif'].join(','),
            fontSize: 20,
        },
        h5: {
            fontFamily: ['Nunito', 'sans-serif'].join(','),
            fontSize: 16,
        },
        h6: {
            fontFamily: ['Nunito', 'sans-serif'].join(','),
            fontSize: 14,
        },
        button: {
            texttransform: 'none',
        },
    },
})

// export const themeSettings = (mode: PaletteMode) => ({
// 	palette: {
// 		mode: mode,
// 		secondary: {
// 			main: '#104c91',
// 			light: '#1f8ac0',
// 			dark: '#082548',
// 			contrastText: '#d9dbe9'
// 		},
// 		primary: {
// 			main: '#EFC9AF',
// 			light: '#fffce1',
// 			dark: '#bc9880',
// 			contrastText: '#2e2c34'
// 		},
// 		background: {
// 			paper: '#24263a',
// 			default: '#14142B'
// 		},
// 		custom: { highlight: '#3b3a54' },
// 		text: {
// 			primary: '#d9dbe9',
// 			secondary: '#2e2c34'
// 		}
// 	}
// })

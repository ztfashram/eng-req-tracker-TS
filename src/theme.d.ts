import { ThemeOptions } from '@mui/material/styles'

// Custom MUI theme, define a custom type for the theme palette that includes the 'highlight' property
declare module '@mui/material/styles' {
    interface Palette extends Record<string, any> {
        custom: { highlight: string }
    }
    interface PaletteOptions extends Record<string, any> {
        custom: { highlight: string }
    }
}

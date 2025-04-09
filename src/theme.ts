import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light', // o 'dark'
        primary: {
            main: '#6200ee', //Primary color
        },
        secondary: {
            main: '#03dac6', // Secundary color
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
    },
});

export default theme;
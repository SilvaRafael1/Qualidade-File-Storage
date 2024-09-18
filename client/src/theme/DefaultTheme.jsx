import { red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles"

const DefaultTheme = createTheme({
    palette: {
        primary: {
            main: "#212b4a"
        },
        secondary: {
            main: "#e7dad3"
        },
        red: {
            main: red[500]
        }
    }
})

export default DefaultTheme;
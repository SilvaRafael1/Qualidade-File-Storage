import { red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles"

const DefaultTheme = createTheme({
    palette: {
        primary: {
            main: "#212b4a"
        },
        secondary: {
            main: "#459e00"
        },
        red: {
            main: red[500]
        }
    }
})

export default DefaultTheme;
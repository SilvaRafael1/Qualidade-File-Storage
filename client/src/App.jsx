import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material";
import DefaultTheme from "./theme/DefaultTheme";

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <ThemeProvider theme={DefaultTheme}>
          <AppBar color="primary" position="static">
            <Toolbar>
              <Typography variant="h4" color="inherit">
                Documentos Institucionais
              </Typography>
            </Toolbar>
          </AppBar>
        </ThemeProvider>
      </div>
    </BrowserRouter>
  )
}

export default App
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material";
import DefaultTheme from "./theme/DefaultTheme";
// Components
import Main from "./components/Main";
import Folder from "./components/Folder";

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

        <div>
          <Routes>
            <Route exact path="/" Component={Main} />
            <Route path="/:id" Component={Folder} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
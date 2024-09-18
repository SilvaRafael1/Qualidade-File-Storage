import { AppBar, Toolbar, Typography, Button, ThemeProvider } from "@mui/material";
import { ExitToApp, Person, Dashboard as DashboardIcon } from "@mui/icons-material";
import DefaultTheme from "../theme/DefaultTheme";
import { Link } from "react-router-dom"

const NavBar = () => {
  const token = localStorage.getItem("token")

  return (
    <ThemeProvider theme={DefaultTheme}>
      <AppBar color="primary" position="static">
        <Toolbar>
          <div className="h-full w-full flex flex-row items-center content-center justify-between">
            <Typography variant="h4" color="inherit">
              Documentos Institucionais
            </Typography>
            {token ? (
              <div>
                <Link to="/dashboard">
                  <Button variant="outlined" startIcon={<DashboardIcon />} color="secondary">
                    Dashboard
                  </Button>
                </Link>
                {" "}
                <Link to="/">
                  <Button variant="contained" startIcon={<ExitToApp />} color="secondary" onClick={() => {
                    localStorage.removeItem("token")
                    window.location.reload()
                  }}>
                    Sair
                  </Button>
                </Link>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="contained" startIcon={<Person />} color="secondary">
                  Entrar
                </Button>
              </Link>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  )
}

export default NavBar;
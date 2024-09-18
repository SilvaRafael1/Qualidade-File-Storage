import { useState, useContext } from "react";
import client from "../api/Api"
import { AuthContext } from "../context/AuthContext";
import { Box, Button, FormControl, FormLabel, TextField, ThemeProvider } from "@mui/material";
import DefaultTheme from "../theme/DefaultTheme";
import { LockOpen, Undo } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const { setToken, setRole } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    try {
      const response = await client.post("/auth/login", formJson);
      setToken(response.data.token);
      setRole(response.data.role)
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      window.location.href = "/dashboard"
    } catch (error) {
      console.error("Authentication failed:", error);
      setToken(null);
      localStorage.removeItem("token");
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <ThemeProvider theme={DefaultTheme}>
      <div className="w-screen flex items-center justify-center flex-col">
        <div className="mt-6 bg-[#fff] w-full max-w-[550px]">
          <Button 
            onClick={() => navigate(-1)} 
            variant="outlined" 
            startIcon={<Undo />}
            size="small"
          >
            Voltar
          </Button>
          <Box
            component="form"
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
              marginTop: 2
            }}
            onSubmit={handleSubmit}
          >
            <FormControl>
              <FormLabel htmlFor="username">Usuário</FormLabel>
              <TextField
                id="username"
                type="text"
                name="username"
                placeholder="Seu usuário"
                autoFocus
                required
                fullWidth
                variant="outlined"
                margin='dense'
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Senha</FormLabel>
              <TextField
                id="password"
                type="password"
                name="password"
                placeholder="Sua senha"
                required
                fullWidth
                variant="outlined"
                margin='dense'
              />
            </FormControl>
            <div className="flex justify-center">
              {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}{" "}
            </div>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              startIcon={<LockOpen />}
            >
              Entrar
            </Button>
          </Box>
        </div>
      </div>
    </ThemeProvider>

  );
};

export default Login;
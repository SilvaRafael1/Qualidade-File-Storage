import { useState } from "react";
import client from "../api/Api"
import { 
  Box, 
  Button, 
  FormControl, 
  FormLabel, 
  InputLabel, 
  MenuItem, 
  Select, 
  TextField, 
  ThemeProvider 
} from "@mui/material";
import DefaultTheme from "../theme/DefaultTheme";
import { PersonAddAlt1 } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";

const RegisterUser = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [okMessage, setOkMessage] = useState(null);
  const [role, setRole] = useState("normal")
  // const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    formJson.role = role;

    if (!(formJson.username || formJson.password)) {
      return setErrorMessage("Por favor preencha todas as informções solicitadas.");
    }

    try {
      await client.post("/auth/register", formJson);
      setOkMessage("Usuário criado com sucesso!")
    } catch (error) {
      console.error("Creation failed:", error);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleChangeRole = (event) => {
    setRole(event.target.value)
  }

  return (
    <ThemeProvider theme={DefaultTheme}>
      <div className="mt-6 w-full max-w-[550px]">
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
              placeholder="novo.usuário"
              autoFocus
              required
              fullWidth
              variant="outlined"
              margin='dense'
            />
         
            <FormLabel htmlFor="password">Senha</FormLabel>
            <TextField
              id="password"
              type="password"
              name="password"
              placeholder="Senha@100"
              required
              fullWidth
              variant="outlined"
              margin='dense'
            />
          </FormControl>
          <InputLabel id="select-label">
            Função: 
            <br /><b>Normal:</b> inclusão e exclusão de arquivos e pastas 
            <br /><b>Admin:</b> conseguem criar e deletar usuários.
          </InputLabel>
          <Select
            labelId="select-label"
            value={role}
            onChange={handleChangeRole}
          >
            <MenuItem value={"normal"}>Normal</MenuItem>
            <MenuItem value={"admin"}>Admin</MenuItem>
          </Select>

          <div className="flex justify-center">
            {okMessage && <div style={{ color: "green" }}>{okMessage}</div>}{" "}
            {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}{" "}
          </div>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            startIcon={<PersonAddAlt1 />}
          >
            Cadastrar
          </Button>
        </Box>
      </div>
    </ThemeProvider>

  );
};

export default RegisterUser;
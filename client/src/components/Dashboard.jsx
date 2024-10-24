import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Link } from "react-router-dom";
import PropTypes from "prop-types"
import { Button, Tabs, Tab, Box, ThemeProvider } from "@mui/material"
import { Folder } from "@mui/icons-material";
import DefaultTheme from "../theme/DefaultTheme";
import { Switch, Case, Default } from "react-if"
import RegisterUser from "./RegisterUser"
import ListUser from "./ListUser";
import RestoreFiles from "./RestoreFiles";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function Dashboard() {
  const { token, loading } = useContext(AuthContext);
  const [value, setValue] = useState(0);
  const [manage, setManage] = useState("")

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (loading) {
    return null;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <ThemeProvider theme={DefaultTheme}>
      <div className="w-full flex items-center justify-center">
        <div className="my-3 bg-[#fff] w-full max-w-[1366px]">
          <Link to="/">
            <Button variant="outlined" startIcon={<Folder />}>
              Ir para as Pastas
            </Button>
          </Link>

          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant="fullWidth">
                <Tab label="Gerenciamento de Usuários" {...a11yProps(0)} />
                <Tab label="Recuperar arquivos deletados" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <div className="flex items-center justify-center flex-col">
                <div className="flex flex-row gap-2">
                  <Button
                    variant={manage == "cadastro" ? "contained" : "outlined"}
                    onClick={() => {
                      setManage("cadastro")
                    }}
                  >
                    Cadastro de Usuário
                  </Button>
                  <Button
                    variant={manage == "list" ? "contained" : "outlined"}
                    onClick={() => {
                      setManage("list")
                    }}
                  >
                    Listar Todos Usuários
                  </Button>
                </div>
                <Switch>
                  <Case condition={manage == "cadastro"}>
                    <RegisterUser />
                  </Case>
                  <Case condition={manage == "list"}>
                    <ListUser />
                  </Case>
                  <Default>
                    <></>
                  </Default>
                </Switch>
              </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <div className="flex items-center justify-center flex-col ">
              <div className="w-[1000px]">
                <RestoreFiles />
              </div>
              </div>
            </CustomTabPanel>
          </Box>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Dashboard;
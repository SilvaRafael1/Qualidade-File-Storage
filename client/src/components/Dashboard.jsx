import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Link } from "react-router-dom";
import PropTypes from "prop-types"
import { Button, Tabs, Tab, Box, ThemeProvider } from "@mui/material"
import { Folder } from "@mui/icons-material";
import DefaultTheme from "../theme/DefaultTheme";

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
                <Tab label="Cadastro de Usuário" {...a11yProps(0)} />
                <Tab label="Recuperar arquivos deletados" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              Item One
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              Item Two
            </CustomTabPanel>
          </Box>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Dashboard;
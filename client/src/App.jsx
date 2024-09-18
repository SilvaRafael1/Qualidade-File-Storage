import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Components
import Main from "./components/Main";
import Folder from "./components/Folder";
import Search from "./components/Search"
import File from "./components/File";
import Login from "./components/Login"
import Dashboard from "./components/Dashboard";
import NavBar from "./components/NavBar";

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <AuthProvider>
          <NavBar />

          <div>
            <Routes>
              <Route exact path="/" Component={Main} />
              <Route path="/:id" Component={Folder} />
              <Route path="/search/:search" Component={Search} />
              <Route path="/file/:id" Component={File} />
              <Route path="/login" Component={Login} />
              <Route path="/dashboard" Component={Dashboard} />
            </Routes>
          </div>
        </AuthProvider>
      </div>
    </BrowserRouter>
  )
}

export default App
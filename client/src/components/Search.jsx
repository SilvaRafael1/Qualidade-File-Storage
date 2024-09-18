import { useEffect, useState } from "react";
import client from "../api/Api";
import DefaultTheme from "../theme/DefaultTheme";
import { ThemeProvider, Button } from "@mui/material";
import { useParams, NavLink } from "react-router-dom";
import ActionTooltip from "./ActionTooltip";
import SearchInput from "./SearchInput";

const Search = () => {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const token = localStorage.getItem("token")

  const { search } = useParams();

  const listSearch = async () => {
    try {
      const res = await client.get(`/search/${search}`);
      if (res.data) {
        setFiles(res.data.files);
        setFolders(res.data.folders);
      } else {
        setFiles([]);
        setFolders([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    listSearch();
  }, []);

  if (folders.length == 0 && files.length == 0) {
    return (
      <ThemeProvider theme={DefaultTheme}>
        <div className="w-screen flex items-center justify-center flex-col">
          <div className="mt-6 bg-[#fff] w-full max-w-[1280px]">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-medium">Procura: {search}</div>
              <div className="flex flex-row gap-2 justify-center">
                <SearchInput />
                <NavLink to={"/"}>
                  <Button variant="contained">
                    Voltar
                  </Button>
                </NavLink>
              </div>
            </div>
            <div className="shadow-xl border border-solid p-5 mt-4">
              Não foi possível encontrar nenhum arquivo!
            </div>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={DefaultTheme}>
      <div className="w-full flex items-center justify-center">
        <div className="my-6 bg-[#fff] w-full max-w-[1280px]">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-medium">Procura: {search}</div>
            <div className="flex flex-row gap-2 justify-center">
              <SearchInput />
              <NavLink to={"/"}>
                <Button variant="contained">
                  Voltar
                </Button>
              </NavLink>
            </div>
          </div>
          <div className="shadow-xl mt-4">
            {folders.map((folder) => (
              <div key={folder._id}>
                <NavLink
                  to={`../${folder._id}`}
                  className="flex justify-between items-center border border-solid hover:bg-[#eee] p-4"
                >
                  <div className="flex">
                    <img src={folder.icon} className="h-6 w-6 mr-3" />
                    {folder.name}
                  </div>
                  {token ? <ActionTooltip id={folder._id} name={folder.name} /> : ""}
                </NavLink>
              </div>
            ))}
            {files.map((file) => (
              <div key={file._id}>
                <a
                  href={`/file/${file._id}`}
                  target="_blank"
                  className="flex justify-between items-center border border-solid hover:bg-[#eee] p-4"
                >
                  <div className="flex">
                    <img src={file.icon} className="h-6 w-6 mr-2" />
                    {file.name}
                  </div>
                  {token ? <ActionTooltip id={file._id} name={file.name} /> : ""}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Search;

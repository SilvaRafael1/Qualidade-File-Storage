import { useEffect, useState } from "react";
import client from "../api/Api";
import DefaultTheme from "../theme/DefaultTheme";
import { ThemeProvider } from "@mui/material/styles";
import ActionButton from "./ActionButton";
import ActionTooltip from "./ActionTooltip";
import SearchInput from "./SearchInput";
import { If, Then, Else } from "react-if";

const Main = () => {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const token = localStorage.getItem("token")

  const listFiles = async () => {
    try {
      const res = await client.get("/folder");
      if (res.data) {
        setFiles(res.data.files);
      } else {
        setFiles([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const listFolders = async () => {
    try {
      const res = await client.get("/folder");
      if (res.data) {
        setFolders(res.data.parent);
      } else {
        setFolders([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    listFiles();
    listFolders();
  }, []);

  return (
    <ThemeProvider theme={DefaultTheme}>
      <div className="w-full flex items-center justify-center">
        <div className="my-6 bg-[#fff] w-full max-w-[1366px] ">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-medium">Pasta Principal</div>
            <div className="flex flex-row gap-2 justify-center">
              <SearchInput />
              {token ? <ActionButton /> : ""}
            </div>
          </div>
          <div className="shadow-xl mt-4 grid grid-cols-3 gap-1">
            {folders.map((folder) => (
              <div key={folder._id}>
                <a
                  href={folder._id}
                  className="flex justify-between items-center border border-solid hover:bg-[#eee] p-4 h-full"
                >
                  <div className="flex">
                    <img src={folder.icon} className="h-6 w-6 mr-2" />
                    {folder.name}
                  </div>
                  {token ? <ActionTooltip id={folder._id} name={folder.name} download={"folder"} /> : ""}
                </a>
              </div>
            ))}
            {files.map((file) => (
              <If condition={file.status} key={file._id}>
                <Then>
                  <If condition={file.ext == "pptx" || file.ext == "ppt"}>
                    <Then>
                      <div >
                        <a
                          // href={`http://localhost/api/file/download/${file._id}`}
                          href={`https://documentos.tacchini.com.br/api/file/download/${file._id}`}
                          className="flex justify-between items-center border border-solid hover:bg-[#eee] p-4 h-full"
                        >
                          <div className="flex">
                            <img src={file.icon} className="h-6 w-6 mr-2" />
                            {file.name}
                          </div>
                          {token ? <ActionTooltip id={file._id} name={file.name} download={file.download} /> : ""}
                        </a>
                    </div>
                    </Then>
                    <Else>
                      <div >
                        <a
                          href={`/file/${file._id}`}
                          className="flex justify-between items-center border border-solid hover:bg-[#eee] p-4 h-full"
                        >
                          <div className="flex">
                            <img src={file.icon} className="h-6 w-6 mr-2" />
                            {file.name}
                          </div>
                          {token ? <ActionTooltip id={file._id} name={file.name} download={file.download} /> : ""}
                        </a>
                    </div>
                    </Else>
                  </If>
                </Then>
                <Else>
                  <></>
                </Else>
              </If>
            ))}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Main;

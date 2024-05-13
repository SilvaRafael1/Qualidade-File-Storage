import React, { useEffect, useState } from "react";
import client from "../api/Api";
import DefaultTheme from "../theme/DefaultTheme";
import { ThemeProvider } from "@mui/material/styles";
import ActionButton from "./ActionButton";

const Main = () => {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);

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
      <div className="w-screen flex items-center justify-center">
        <div className="mt-6 bg-[#fff] w-full max-w-[1280px] ">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-medium">Pasta Principal</div>
            <div className="flex flex-row gap-2">
              <ActionButton />
            </div>
          </div>
          <div className="shadow-xl mt-4">
            {folders.map((folder) => (
              <div key={folder._id}>
                <a
                  href={folder._id}
                  className="flex items-center border border-solid hover:bg-[#eee] p-5"
                >
                  <img src={folder.icon} className="h-6 w-6 mr-2" />
                  {folder.name}
                </a>
              </div>
            ))}
            {files.map((file) => (
              <div key={file._id}>
                <a
                  href={file.path}
                  target="_blank"
                  className="flex items-center border border-solid hover:bg-[#eee] p-5"
                >
                  <img src={file.icon} className="h-6 w-6 mr-2" />
                  {file.name}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Main;

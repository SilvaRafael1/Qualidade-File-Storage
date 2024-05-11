import React, { useEffect, useState } from "react";
import client from "../api/Api";
import DefaultTheme from "../theme/DefaultTheme";
import { ThemeProvider, Button } from "@mui/material";
import { useParams } from "react-router-dom";

const Folder = () => {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [paiId, setPaiId] = useState("/");
  const [title, setTitle] = useState("");

  const { id } = useParams();

  const listFiles = async () => {
    try {
      const res = await client.get(`/folder/${id}`);
      if (res.data) {
        setTitle(res.data.name);
        setPaiId(`/${res.data.pai}`);
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
      const res = await client.get(`/folder/${id}`);
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

  if (folders.length == 0 && files.length == 0) {
    return (
      <ThemeProvider theme={DefaultTheme}>
        <div className="w-screen flex items-center justify-center flex-col">
          <div className="mt-6 bg-[#fff] w-full max-w-[1280px]">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-medium">
                {title}
              </div>
              <Button variant="contained" href={paiId}>Voltar</Button>
            </div>
            <div className="shadow-xl border border-solid p-5 mt-4">
              Pasta está vazia
            </div>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={DefaultTheme}>
      <div className="w-screen flex items-center justify-center">
        <div className="mt-6 bg-[#fff] w-full max-w-[1280px] shadow-xl">
          {folders.map((folder) => (
            <div key={folder._id}>
              <a
                href={folder._id}
                className="flex items-center border border-solid hover:bg-[#eee] p-5"
              >
                <img src={folder.icon} className="h-6 w-6 mr-3" />
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
    </ThemeProvider>
  );
};

export default Folder;

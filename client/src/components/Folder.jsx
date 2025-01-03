import { useEffect, useState } from "react";
import client from "../api/Api";
import DefaultTheme from "../theme/DefaultTheme";
import { 
  ThemeProvider, 
  Button, 
  Breadcrumbs, 
  Link,
  Typography
} from "@mui/material";
import { useParams } from "react-router-dom";
import ActionButton from "./ActionButton";
import ActionTooltip from "./ActionTooltip";
import SearchInput from "./SearchInput";
import { If, Then, Else } from "react-if";

const Folder = () => {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [bread, setBread] = useState([]);
  const [paiId, setPaiId] = useState("/");
  const [title, setTitle] = useState("");
  const token = localStorage.getItem("token")

  const { id } = useParams();

  const listFiles = async () => {
    try {
      const res = await client.get(`/folder/${id}`);
      if (res.data) {
        setTitle(res.data.name);
        if (res.data.pai == "66bb480a577f3ec36762ea14") {
          setPaiId("/")
        } else {
          setPaiId(`/${res.data.pai}`);
        }
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

  const listBreadcrumbs = async () => {
    try {
      const res = await client.get(`/folder/breadcrumbs/${id}`);
      if (res.data) {
        setBread(res.data);
      } else {
        setBread([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    listFiles();
    listFolders();
    listBreadcrumbs();
  }, []);

  if (folders.length == 0 && files.length == 0) {
    return (
      <ThemeProvider theme={DefaultTheme}>
        <div className="w-screen flex items-center justify-center flex-col">
          <div className="mt-6 bg-[#fff] w-full max-w-[1366px]">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-medium">{title}</div>
              <div className="flex flex-row gap-2 justify-center">
                <SearchInput />
                {token ? <ActionButton /> : ""}
                <Button variant="contained" href={paiId}>
                  Voltar
                </Button>
              </div>
            </div>
            <div>
              <Breadcrumbs maxItems={5}>
                {bread.map((bread) => (
                  <Link underline="hover" color="inherit" href={`../${bread.id}`} key={bread.id}>
                    {bread.name}
                  </Link>
                ))}
                <Link underline="hover" color="inherit" href={id} key={id}>
                  <Typography color="primary">{title}</Typography>
                </Link>
              </Breadcrumbs>
            </div>
            <div className="shadow-xl border border-solid p-5 mt-2">
              Pasta está vazia
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
            <div className="text-2xl font-medium">{title}</div>
            <div className="flex flex-row gap-2 justify-center">
              <SearchInput />
              {token ? <ActionButton /> : ""}
              <Button variant="contained" href={paiId}>
                Voltar
              </Button>
            </div>
          </div>
          <div>
            <Breadcrumbs maxItems={5}>
              {bread.map((bread) => (
                <Link underline="hover" color="inherit" href={`../${bread.id}`} key={bread.id}>
                  {bread.name}
                </Link>
              ))}
              <Typography color="primary">{title}</Typography>
            </Breadcrumbs>
          </div>
          <div className="shadow-xl mt-2">
            {folders.map((folder) => (
              <div key={folder._id}>
                <a
                  href={folder._id}
                  className="flex justify-between items-center border border-solid hover:bg-[#eee] p-4"
                >
                  <div className="flex">
                    <img src={folder.icon} className="h-6 w-6 mr-3" />
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

export default Folder;

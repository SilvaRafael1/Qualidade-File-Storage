import DefaultTheme from "../theme/DefaultTheme";
import { ThemeProvider } from "@mui/material/styles";
import { Button } from "@mui/material"
import { Worker, Viewer as ViewerPDF, SpecialZoomLevel } from "@react-pdf-viewer/core"
import { zoomPlugin } from "@react-pdf-viewer/zoom"
import "@react-pdf-viewer/core/lib/styles/index.css"
import { useParams } from "react-router-dom";
import client from "../api/Api";
import { useEffect, useState } from "react";
import Viewer, { DocxViewer } from "react-office-viewer"
import "../css/InputDisable.css"

import { Switch, Case, Default } from "react-if"

const File = () => {
  const { id } = useParams()
  const [file, setFile] = useState([])
  const [paiId, setPaiId] = useState("../");
  const [filePath, setFilePath] = useState("")
  const zoomPluginInstance = zoomPlugin()
  const { ZoomInButton, ZoomOutButton, ZoomPopover, zoomTo } = zoomPluginInstance

  function replaceSpaces(input) {
    let rep = "%20"
    for (let i = 0; i < input.length; i++) {
      if (input[i] == ' ')
        input = input.replace(input[i], rep);
    }
    return input;
  }

  const listFile = async () => {
    try {
      const res = await client.get(`/file/${id}`);
      if (res.data) {
        setFile(res.data);
        setFilePath(replaceSpaces(res.data.path))
        if (res.data.pai == "66bb480a577f3ec36762ea14") {
          setPaiId("/")
        } else {
          setPaiId(`/${res.data.pai}`);
        }
      } else {
        setFile([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    listFile();
  }, []);

  let params = {
    fileName: file.name,
    locale: "en",
    height: "680px"
  }

  return (
    <ThemeProvider theme={DefaultTheme}>
      <div className="w-full flex items-center justify-center" style={{}}>
        <div className="my-3 bg-[#fff] w-full max-w-[1366px]">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-medium">{file.name}</div>
            <div className="flex flex-row gap-2 justify-center">
              <Button variant="contained" href={paiId}>
                Voltar
              </Button>
            </div>
          </div>
          <Switch>
            <Case condition={file.ext === "pdf"}>
              <div className="mt-3 border-solid border-[1px] border-pdf03-rgba flex flex-col h-full">
                <div className="items-center bg-[#eeeeee] border-b-pdf01-rgba flex justify-center p-[4px]">
                  <ZoomOutButton />
                  <ZoomPopover />
                  <ZoomInButton />
                </div>
                <div className="flex-1 overflow-hidden">
                  <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                    <div className="h-[750px] border-solid border-[1px] border-pdf-rgba p-2">
                      {file.path ? (
                        <ViewerPDF
                          plugins={[zoomPluginInstance]}
                          fileUrl={file.path}
                          defaultScale={() => zoomTo(SpecialZoomLevel.PageFit)}
                        />
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </Worker>
                </div>
              </div>
            </Case>
            <Case condition={file.ext === "docx"}>
              <DocxViewer file={filePath} {...params} />
            </Case>
            <Default>
              <Viewer file={filePath} {...params} />
            </Default>
          </Switch>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default File
import { useEffect, useState } from "react";
import client from "../api/Api";
import ActionTooltipRestore from "./ActionTooltipRestore";

const RestoreFiles = () => {
  const [files, setFiles] = useState([])

  const listFiles = async () => {
    try {
      const res = await client.get(`/file/`);
      if (res.data) {
        setFiles(res.data);
      } else {
        setFiles([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    listFiles();
  }, []);

  return (
    <div className="shadow-xl">
      {files.map((file) => (
        <div key={file._id}>
          <a
            href={`/file/${file._id}`}
            className="flex justify-between items-center border border-solid hover:bg-[#eee] p-4"
          >
            <div className="flex">
              <img src={file.icon} className="h-6 w-6 mr-2" />
              {file.name}
            </div>
            <div className="text-gray-500">em {file.pai.name}</div>
            <ActionTooltipRestore id={file._id} name={file.name} />
          </a>
        </div>
      ))}
    </div>
  )
}

export default RestoreFiles;
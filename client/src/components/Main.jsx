import React, { useEffect, useState } from 'react'
import client from "../api/Api"
import DefaultTheme from '../theme/DefaultTheme'
import { ThemeProvider } from '@mui/material/styles'

const Main = () => {
 const [files, setFiles] = useState([])

 const listFiles = async () => {
    try {
      const res = await client.get("/folder")
      if (res.data) {
        setFiles(res.data)
      } else {
        setFiles([])
      }
    } catch (error) {
      console.error(error)
    }
 }

 useEffect(() => {
    listFiles()
 }, [])

 console.log(files)

  return (
    <ThemeProvider theme={DefaultTheme}>
        {
            files.map(file => (
                <div key={file._id}>
                    <a href={file.path} target='_blank' className='flex m-5 items-center'>
                      <img src={file.icon} className='h-6 w-6'/>
                      {file.name}
                    </a>
                </div>
            ))
        }
    </ThemeProvider>
  )
}

export default Main
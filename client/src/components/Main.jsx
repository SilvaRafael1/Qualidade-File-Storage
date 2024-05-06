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

  return (
    <ThemeProvider theme={DefaultTheme}>
        {
            files.map(file => (
                <p key={file._id} className='m-5'>
                    <a href={file.path} target='_blank'>
                        {file.name}
                    </a>
                </p>
            ))
        }
    </ThemeProvider>
  )
}

export default Main
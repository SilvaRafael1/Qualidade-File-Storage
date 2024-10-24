import { useState } from 'react'
import { Restore } from "@mui/icons-material"
import { 
  Tooltip, 
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import client from "../api/Api";

const ActionTooltipRestore = ({id, name}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState("");

  const handleDialog = (event) => {
    event.preventDefault();
    setOpenDialog(true)
  }
  const handleDialogClose = () => {
    setError("")
    setOpenDialog(false)
  }

  return (
    <div>
      <Tooltip title="Restaurar" onClick={handleDialog}>
        <IconButton size='small'>
          <Restore fontSize='small' color='red' />
        </IconButton>
      </Tooltip>

      {/* Dialogo para deletar */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            client.get(`/file/restore/${id}`).then(() => {
              handleDialogClose();
              location.reload();
            })
          }
        }}
      >
        <DialogTitle>Restaurar Arquivo</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <span>Tem certeza que deseja restaurar o arquivo com o nome de <b>{name}</b>.<br /></span>
            <span className='text-red-500'>
              {error ? error : ""}
            </span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancelar</Button>
          <Button type='submit' variant="contained">Restaurar</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default ActionTooltipRestore;
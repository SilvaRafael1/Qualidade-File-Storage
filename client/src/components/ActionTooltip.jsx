import { useState } from 'react'
import { Delete, Edit } from "@mui/icons-material"
import { 
  Tooltip, 
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from "@mui/material";
import client from "../api/Api";

const ActionTooltip = ({id, name}) => {
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [openDialogRename, setOpenDialogRename] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = (event) => {
    event.preventDefault();
    setOpenDialogDelete(true)
  }
  const handleDeleteClose = () => {
    setError("")
    setOpenDialogDelete(false)
  }
  
  const handleRename = (event) => {
    event.preventDefault();
    setOpenDialogRename(true)
  }
  const handleRenameClose = () => {
    setOpenDialogRename(false)
  }

  return (
    <div>
      <Tooltip title="Renomear" onClick={handleRename}>
        <IconButton size='small'>
          <Edit fontSize='small' />
        </IconButton>
      </Tooltip>
      <Tooltip title="Excluir" onClick={handleDelete}>
        <IconButton size='small'>
          <Delete fontSize='small' color='red' />
        </IconButton>
      </Tooltip>

      {/* Dialogo para deletar */}
      <Dialog
        open={openDialogDelete}
        onClose={handleDeleteClose}
      >
        <DialogTitle>Deletar Arquivo</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <span>Tem certeza que deseja deletar o arquivo com o nome de <b>{name}</b>.<br /></span>
            <span className='text-red-500'>
              {error ? error : ""}
            </span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancelar</Button>
          <Button type="submit" variant="contained" color='red' onClick={() => {
            client.delete(`/delete/${id}`).then((response) => {
              if (response.data == "Pasta deletada." || response.data == "Arquivo deletado.") {
                handleDeleteClose();
                location.reload();
              } else {
                setError(response.data)
              }
            });
          }}>
            <span className='text-white'>
              Deletar
            </span>
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialogo para editar */}
      <Dialog
        open={openDialogRename}
        onClose={handleRenameClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            formJson.id = id
            formJson.oldName = name
            client.put("/rename", formJson).then(() => {
              handleRenameClose();
              location.reload();
            })
          }
        }}
      >
        <DialogTitle>Renomear Arquivo</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <span>Você irá renomear <b>{name}</b> para:<br /></span>
            <span className='text-red-500'>
              {error ? error : ""}
            </span>
          </DialogContentText>
          <TextField 
            autoFocus
            required
            margin='dense'
            id='newName'
            name='newName'
            label='Novo nome'
            type='text'
            fullWidth
            variant='standard'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRenameClose}>Cancelar</Button>
          <Button type='submit' variant="contained">Renomear</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default ActionTooltip
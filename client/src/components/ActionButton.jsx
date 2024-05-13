import { useState } from "react";
import client from "../api/Api";
import { useParams } from "react-router-dom"
import { 
  Button, 
  Menu, 
  MenuItem, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle,
  TextField,
  Alert
} from "@mui/material";

const ActionButton = () => {
  const { id } = useParams()

  // Menu
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const openMenu = Boolean(menuAnchorEl);
  const handleMenuClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  // Dialog Adição de Arquivos
  const [openDialogFiles, setOpenDialogFiles] = useState(false);
  const handleDialogFilesClick = () => {
    handleMenuClose()
    setOpenDialogFiles(true);
  };
  const handleDialogFilesClose = () => {
    setOpenDialogFiles(false);
  };
  
  // Dialog Adição de Pastas
  const [openDialogFolders, setOpenDialogFolders] = useState(false);
  const handleDialogFoldersClick = () => {
    handleMenuClose()
    setOpenDialogFolders(true);
  };
  const handleDialogFoldersClose = () => {
    setOpenDialogFolders(false);
  };

  // Submit Folder
  const handleSubmitFolder = (data) => client.post("/folder", data).then(() => {
    <Alert severity="success">Pasta criada com sucesso.</Alert>
    handleDialogFoldersClose();
    location.reload()
  })

  return (
    <div>
      <Button
        id="basic-menu"
        aria-controls={openMenu ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={openMenu ? "true" : undefined}
        onClick={handleMenuClick}
        variant="outlined"
      >
        Ações
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={menuAnchorEl}
        open={openMenu}
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleDialogFilesClick}>Adicionar Arquivos</MenuItem>
        <MenuItem onClick={handleDialogFoldersClick}>Nova Pasta</MenuItem>
      </Menu>

      {/* Dialogo para adição de arquivos */}
      <Dialog
        open={openDialogFiles}
        onClose={handleDialogFilesClose}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            console.log(email);
            handleDialogFilesClose();
          },
        }}
      >
        <DialogTitle>Arquivo</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogFilesClose}>Cancel</Button>
          <Button type="submit" variant="contained">Subscribe</Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialogo para adição de pastas */}
      <Dialog
        open={openDialogFolders}
        onClose={handleDialogFoldersClose}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            formJson.paiId = id;
            formJson.parentId = id;
            handleSubmitFolder(formJson);
          },
        }}
      >
        <DialogTitle>Adicionar Pasta</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Digite o nome desejado para a nova pasta.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Nome da Pasta"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogFoldersClose}>Cancelar</Button>
          <Button type="submit" variant="contained">Adicionar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ActionButton;

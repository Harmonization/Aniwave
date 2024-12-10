import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function FormDialog({submitFunc}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen} sx={{mt:3, width: '100%', bgcolor: 'aqua', color: 'white'}}>
        Сохранить все ROI
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            submitFunc(email)
            handleClose();
          },
        }}
      >
        <DialogTitle>Сохранить результат на диск</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Введите имя для сохранения на диск. Если такой файл уже существует, операция будет приостановлена. Сохраняется группа файлов (ROI), которые были предобработаны. Их имя указывается следующим образом: "[УказанноеИмя]_[i]", где i - это номер ROI.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Имя файла"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Назад</Button>
          <Button type="submit">Сохранить</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

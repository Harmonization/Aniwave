import * as React from 'react';
import { useLoaderData } from 'react-router-dom'

import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
// import PersonIcon from '@mui/icons-material/Person';
// import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { blue, green, red } from '@mui/material/colors';
import SelectAllTransferList from './SelectAllTransferList';
// import AssignmentIcon from '@mui/icons-material/Assignment';
import HomeIcon from '@mui/icons-material/Home';
import FolderIcon from '@mui/icons-material/Folder';
import CancelIcon from '@mui/icons-material/Cancel';

import getDiskFiles from '../../Functions/getDiskFiles'

// const emails = ['user02@gmail.com'];

function SimpleDialog(props) {
  const { onClose, selectedValue, open } = props;
  const { diskFolders } = useLoaderData()

  // const [files, setFiles] = React.useState(diskFolders)

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = async (value) => {
    onClose(value);
    // const files = await getDiskFiles(value)
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Выберите файл для открытия</DialogTitle>
      {props.component1}
      <List sx={{ pt: 0 }}>
        {diskFolders.map((email) => (
          <ListItem disablePadding key={email}>
            <ListItemButton onClick={() => handleListItemClick(email)}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: selectedValue === email ? blue[500] : "#FFFFFF", color: "#00e676" }}>
                  <FolderIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={email} />
            </ListItemButton>
          </ListItem>
        ))}

        <ListItem disablePadding>
          <ListItemButton
            autoFocus
            onClick={() => handleListItemClick()}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: !selectedValue ? "#00e676" : "#FFFFFF", color: blue[500] }}>
                <HomeIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Общее" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            autoFocus
            onClick={() => props.setOpen(false)}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: "#FFFFFF" , color: red[500] }}>
                <CancelIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Закрыть" />
          </ListItemButton>
        </ListItem>
      </List>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

export default function OpenDialog({component1, open, setOpen, url, openImg}) {
  // const [open, setOpen] = React.useState(false);
  const { diskFiles, downloadedFiles } = useLoaderData()
  const [files, setFiles] = React.useState(diskFiles)

  const [selectedValue, setSelectedValue] = React.useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = async (value) => {
    setOpen(false);
    setSelectedValue(value);
    const update_files = await getDiskFiles(value)
    setFiles([...update_files.filter(file => downloadedFiles.indexOf(file) === -1)])
    setOpen(true);
  };

  return (
    <div>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Открыть HSI
      </Button> */}
      
      <SimpleDialog
        component1={<SelectAllTransferList url={url} openImg={openImg} setOpen={setOpen} diskFiles={files}/>}
        selectedValue={selectedValue}
        open={open}
        setOpen={setOpen}
        onClose={handleClose}
      />
      {/* <Typography variant="subtitle1" component="div">
        Открыто: {selectedValue}
      </Typography> */}
    </div>
  );
}

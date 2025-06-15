import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';


export default function LeftMenu({navigation}) {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const DrawerList = (
    <Box sx={{ width: 300 }} role="presentation" > 
      <List>
        {navigation.map(({title, icon, click, type, content, openedAfterClick}) => (
            type !== 'button' 
            ? 
            <ListItem key={title} disablePadding>
              {content}
            </ListItem>
            : 
            <ListItem key={title} disablePadding onClick={toggleDrawer(openedAfterClick)}>
              {content}
              <ListItemButton onClick={e => click(e)}>

                <ListItemIcon>
                  {icon}
                </ListItemIcon>

              <ListItemText primary={title} />

              </ListItemButton>

            </ListItem>
        ))}        
      </List>
      
      {/* <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
    </Box>
  );

  return (
    <div>
      {/* <Button onClick={toggleDrawer(true)}>Меню</Button> */}
      <IconButton sx={{ p: '10px' }} aria-label="menu" onClick={toggleDrawer(true)}>
        <MenuIcon />
      </IconButton>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}

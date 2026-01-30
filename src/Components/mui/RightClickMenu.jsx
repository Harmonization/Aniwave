import * as React from 'react';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';


export default function RightClickMenu({display='none', x=0, y=0, buttonItems=[]}) {
  
  return (
    <Paper sx={{ width: 320, maxWidth: '100%', position: 'absolute', display, marginLeft: `${x}px`, marginTop: `${y}px`, zIndex: 5 }}>
      <MenuList>

        {buttonItems.map((el, i) => 
        <div key={`context-menu-item-${i}`}>
          <MenuItem onClick={el.onClick}>
            <ListItemIcon>
               {el.icon}
            </ListItemIcon>
            <ListItemText>{el.text}</ListItemText>
          </MenuItem>
          {el.divider && <Divider />}
        </div>
      )}

      </MenuList>
    </Paper>
  );
}

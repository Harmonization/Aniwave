import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import FormDialog from './FormDialog'

import SmartInput from './SmartInput';

import getRandomColor from '../../Functions/getRandomColor';
import str2Numbers from '../../Functions/str2numbers';

export default function RoiList({itemStory, setItem, submitFunc, changeRoi}) {
  const handleToggle = (value) => () => {
    setItem([...itemStory.map((roi, j) => j != value ? {...roi, active: false} : {...roi, active: true})])
    changeRoi(...str2Numbers(itemStory[value].roi_str))
  };

  const pressInput = e => {
    if (e.key === 'Enter') {
      setItem([...itemStory.map((roi, i) => e.target.id !== `list-smart-input-${i}` ? roi : {...roi, roi_str: e.target.value})])
    }
  }

  const pressButton = e => {
    setItem([...itemStory.map((roi, i) => e.target.id !== `list-button-${i}` ? roi : {...roi, color: getRandomColor()})])
  }

  return (
    <List dense sx={{ width: '100%', maxWidth: 460, maxHeight: 400, overflow: 'auto',  position: 'relative', '& ul': { padding: 0 }, bgcolor: 'rgba(0,0,0,0.01)' }}>
      <ListItem>
        <FormDialog submitFunc={submitFunc}/>
      </ListItem>
      {itemStory.map((roi, i) => {
        const labelId = `checkbox-list-secondary-label-${i}`;
        return (
          <ListItem
            key={`list-item-${i}`}
            secondaryAction={
              <Checkbox
                edge="end"
                onChange={handleToggle(i)}
                checked={roi.active}
                inputProps={{ 'aria-labelledby': labelId }}
                style={{color: roi.color}}
              />
            }
            disablePadding
          >
            <ListItemButton onClick={pressButton} id={`list-button-${i}`}>
              {/* <ListItemAvatar>
                <Avatar
                  alt={`Avatar n°${i + 1}`}
                  // src={`./static/cloud.jpg`}
                  style={{color: roi.color}}
                />
              </ListItemAvatar> */}

              <SmartInput value={roi.roi_str} title={i==0 ? 'Все изображение' : `ROI ${i}`} id={`list-smart-input-${i}`} pressChannel={pressInput}/>

            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}
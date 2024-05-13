import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function SelectStatic({menuItems, currentValue, changeFunc, title='Статистика', nullElem=false}) {
  const [value, setValue] = React.useState('')

  const handleChange = e => {
    if (!currentValue) setValue(e.target.value)
    if (changeFunc) changeFunc(e.target.value)
  }

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 140 }} style={{ margin: 15 }}>
        <InputLabel id="demo-simple-select-autowidth-label">{title}</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={currentValue ? currentValue : value}
          onChange={handleChange}
          autoWidth
          label={`${title}`}
          
        >
          {nullElem && <MenuItem value="">
            <em>None</em>
          </MenuItem>}
          
          {Object.keys(menuItems).map((key, indx) => <MenuItem value={key} key={`select-item-${indx}`}>{menuItems[key]}</MenuItem>)}
        </Select>
      </FormControl>
    </div>
  );
}
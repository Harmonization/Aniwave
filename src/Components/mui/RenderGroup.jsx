import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function RenderGroup({options, pressEnter}) {

  

  return (
    <Autocomplete
      className='add-image-textarea'
      options={options}
      onKeyDown={pressEnter}
      freeSolo
      groupBy={(option) => option.group}
    //   getOptionLabel={(option) => option.label}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Добавить изображение" />}
    //   renderGroup={(params) => (
    //     <li key={params.key}>
    //       <GroupHeader>{params.group}</GroupHeader>
    //       <GroupItems>{params.children}</GroupItems>
    //     </li>
    //   )}
    />
  );
}

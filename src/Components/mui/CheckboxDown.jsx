import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function CheckboxDown({title, checkFunc}) {
  return (
    <FormControl component="fieldset">
      {/* <FormLabel component="legend">Label placement</FormLabel> */}
      <FormGroup aria-label="position" row>
        <FormControlLabel
          value="bottom"
          control={<Checkbox onChange={checkFunc}/>}
          label={title}
          labelPlacement="bottom"
        />
      </FormGroup>
    </FormControl>
  );
}

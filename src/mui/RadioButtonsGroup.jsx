import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function RowRadioButtonsGroup({setPlot}) {
  return (
    <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">График</FormLabel>
      <RadioGroup
        onChange={e => setPlot(e.target.value)}
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        defaultValue="hist"
      >
        <FormControlLabel value="sign" control={<Radio />} label="Спектральная сигнатура"/>
        <FormControlLabel value="der" control={<Radio />} label="Производная спектра" />
        <FormControlLabel value="hist" control={<Radio />} label="Гистограмма канала" />
      </RadioGroup>
    </FormControl>
  );
}
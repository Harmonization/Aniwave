import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { Typography } from '@mui/material';

export default function SliderSizes({changeFunc, min=0, max=25, value=5, title='Длина окна фильтрации', changeCommit}) {
  return (
    <Box sx={{ width: 400 }}>
      <Typography textAlign='center' id="input-slider" gutterBottom><strong>{title}</strong></Typography>
      <Slider 
        color="secondary"
        min={min}
        max={max}
        onChange={changeFunc}
        onChangeCommitted={changeCommit}
        value={value}
        aria-label="Default" 
        valueLabelDisplay="auto"
        
      />
    </Box>
  );
}
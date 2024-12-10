import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import NumberSlider from "../mui/NumberSlider";



export default function Track({value, handleChange, marks, min=-1, max=1, step=.01, title='Отделение от фона'}) {
  if (!marks) {
    const stepLabel = (max - min) / 4
    const marks = [{
      value: 0,
      label: `0`
    }]
    for (let i = min; i <= max; i+=stepLabel) {
      marks.push({
        value: i,
        label: `${Math.round(i*100)/100}`
      })
    }
  }

  if (typeof value === Number) {
    return (
      <NumberSlider
        min={min}
        max={max}
        title={title}
        step={step}
        changeFunc={handleChange}
        value={value}
      />
    )
  }

  return (

    

    <Box sx={{ width: 450 }} ml={3}>
      <Typography textAlign='center' id="track-inverted-range-slider" gutterBottom>
        <strong>{title}</strong>
      </Typography>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs>
            <Slider
              value={value}
              onChange={handleChange}
              aria-labelledby="track-inverted-range-slider"
              valueLabelDisplay="auto" 
              step={step}
              min={min}
              max={max}
              marks={marks}
              color="secondary"
            />
        </Grid>
      </Grid>
    </Box>
  );
}
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import NumberSlider from "../mui/NumberSlider";

const Separator = styled('div')(
  ({ theme }) => `
  height: ${theme.spacing(3)};
`,
);

const marks = [
  {
    value: 0,
    label: '0',
  },
  {
    value: 18,
    label: '18',
  },
  {
    value: 51,
    label: '51',
  },
  {
    value: 70,
    label: '70',
  },
  {
    value: 203,
    label: '203',
  },
];

function valuetext(value) {
  return `${value}`;
}

export default function Slider3({value, handleChange, min=0, max=203, step=1, title='Номер канала', handleCommit}) {
  return (
    <Box width={1000}>

      <NumberSlider
          track={false}
          aria-labelledby="track-false-range-slider"
          getAriaValueText={valuetext}
          defaultValue={[18, 51, 70]}
          marks={marks}
          step={step}
          min={min}
          max={max}
          title={title}
          changeFunc={handleChange}
          changeCommit={handleCommit}
          value={value}
        />
    </Box>
  );
}

import * as React from 'react';
import { useLoaderData } from "react-router-dom";

import { LineChart } from '@mui/x-charts/LineChart';

import getRandomColor from '../../Functions/getRandomColor';

export default function LinePlot({data, width=500, height=300, mode='multy', startBand=0, endBand=203, type='signal'}) {
  const {nm} = useLoaderData()
  const cropNm = nm.slice(startBand, endBand + 1)
  let series
  if (mode === 'multy') series = data.length !== 0 ? data.map(data_item => ({data: data_item[type].sign, showMark: false, color: data_item.color})) : [{data: cropNm, showMark: false, color: 'coral'}]
  if (mode !== 'multy') series = [{data: data, showMark: false, color: getRandomColor()}]

  let xContent, yLabel
  if (series[0].data.length <= 204) {
    xContent = { data: cropNm, max: nm[endBand]+15, min: nm[startBand]-15, label: 'Wavelength' }
    yLabel = 'Reflectance'
  }
  else {
    let bands = []; 
    for(let i=0; i<series[0].data.length + (type === 'signal' ? 0 : 1); i++) {
      bands.push(i);
    }
    const cropBands = bands.slice(startBand, endBand + 1)
    xContent = { data: cropBands, max: bands[endBand]+15, min: bands[startBand]-15, label: 'Band' }
    yLabel = ''
  }
  return (
    <LineChart
      xAxis={[xContent]}
      series={series}
      width={width}
      height={height}
      margin={{ top: 10, bottom: 30, left: 60, right: 10 }}
      yAxis={[{label: yLabel}]}
      sx={{
        '& .MuiLineElement-root': {
          // strokeDasharray: '10 5',
          strokeWidth: 4,
        },
        '& .MuiChartsAxis-tickLabel tspan': {
          fontSize: 14,
        },
        '& .MuiChartsAxis-label tspan': {
          fontSize: 18
        }
      }}
    />
  );
}
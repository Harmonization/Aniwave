import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import getRandomColor from '../../Functions/getRandomColor';

export default function HistPlot({hist, bins, width=600, height=200, xlabel=''}) {
  console.log(hist)
  return (
    <BarChart
      series={hist}
      width={width}
      height={height}
      xAxis={[{ data: bins, scaleType: 'band', label: xlabel }]}
      margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
    />
  );
}

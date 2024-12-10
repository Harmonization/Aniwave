import * as React from 'react';

import { ScatterChart } from '@mui/x-charts/ScatterChart';

import getRandomColor from '../../Functions/getRandomColor';

export default function RegPlot({line_x, line_y, point_x, point_y, line_name, point_name, xlabel='', ylabel='', width=500, height=450}) {

    const pointData = point_x.map((el, i) => ({id: `point-${i}`, x: el, y: point_y[i]}))
    const regData = line_x.map((el, i) => ({id: `reg-${i}`, x: el, y: line_y[i]}))
    const series = [
        {
            data: pointData,
            color: getRandomColor(),
            label: point_name,
        },
        {
            data: regData,
            color: 'white',
            label: line_name
        }
    ]
  return (
    <ScatterChart
        series={series}
        width={width}
        height={height}
        xAxis={[{label: xlabel}]}
        yAxis={[{label: ylabel}]}
        sx={{
        '& .MuiLineElement-root': {
            // strokeDasharray: '10 5',
            strokeWidth: 4,
        },
        '& .MuiChartsAxis-tickLabel tspan': {
            fontSize: 14,
        }
        }}
    />
  );
}
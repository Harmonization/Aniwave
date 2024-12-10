import RegPlot from '../plots/RegPlot';
import HistPlot from '../plots/HistPlot'

import { Stack } from '@mui/material'

export default function RegHist({plotProps, histProps, width=500}) {
    const {hist, bins, colorHist} = histProps;
    const {line_x, line_y, point_x, point_y, line_name, point_name, xlabel, ylabel} = plotProps;
    return (
        <Stack>
            <HistPlot hist={hist} bins={bins} color={colorHist} width={width} height={100}/>
            <RegPlot line_x={line_x} line_y={line_y} point_x={point_x} point_y={point_y} line_name={line_name} point_name={point_name} xlabel={xlabel} ylabel={ylabel}/>
        </Stack>
    )
}
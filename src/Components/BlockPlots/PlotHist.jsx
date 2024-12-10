import LinePlot from '../plots/LinePlot'
import HistPlot from '../plots/HistPlot'

import { Stack } from '@mui/material'

export default function PlotHist({plotProps, histProps, width=500}) {
    const {hist, bins, colorHist} = histProps;
    const {data, height, startBand=0, endBand=203, type='signal'} = plotProps;
    return (
        <Stack>
            <HistPlot hist={hist} bins={bins} color={colorHist} width={width}/>
            <LinePlot data={data} height={height} width={width} startBand={startBand} endBand={endBand} type={type}/>
        </Stack>
    )
}
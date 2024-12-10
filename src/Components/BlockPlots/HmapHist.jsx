import Heatmap from "../plots/Heatmap";
import HistPlot from "../plots/HistPlot";

import { Stack } from "@mui/material";

export default function HmapHist({histProps, hmapProps, width=600}) {
    const {hist, bins} = histProps;
    const {z, clickFunc, colorHmap, flagNull, type, shapes} = hmapProps;
    return (
        <Stack>
            <HistPlot hist={hist} bins={bins} width={width}/>
            <Heatmap z={z} clickFunc={clickFunc} color={colorHmap} flagNull={flagNull} type={type} width={width-20} shapes={shapes}/>
        </Stack>
    )
}
import { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";

import Stack from "@mui/material/Stack";
import { Button } from "@mui/material";

import HmapHist from '../BlockPlots/HmapHist.jsx'

import getRandomColor from '../../Functions/getRandomColor.js'
import getFetch from "../../Functions/getFetch.js";


export default function Apply({ urlServer, hmap, setHmap }) {

    const getTir = async (name) => {
        const {tir} = await getFetch(urlServer, 'tir', {name})
        setHmap({...hmap, tir})
    }
    
    return (
        <Stack direction={'row'} spacing={5}>
            <Button onClick={e => getTir('3.xlsx')}>Open TIR</Button>
            {hmap.channel && <HmapHist 
                histProps={{hist: [{data: hmap.hist, color: getRandomColor()}], bins: hmap.bins, colorHist: 'pink'}}
                hmapProps={{
                    z: hmap.channel, 
                    colorHmap: hmap.colormap, flagNull: false, type: hmap.type, 
                    // clickFunc: async (e) => {
                    //     const { x, y } = e.points[0];
                    //     if (hmapMode) await getRegression(x, y);
                    //     else await pushSpectre(e) // getSpectre(x, y);
                    // },
                    // shapes: convert2Shapes()
                }}
          />}
          {hmap.tir && <HmapHist 
                histProps={{hist: [{data: hmap.tir.hist, color: getRandomColor()}], bins: hmap.tir.bins, colorHist: 'pink'}}
                hmapProps={{
                    z: hmap.tir.data, 
                    colorHmap: hmap.colormap, flagNull: false, type: hmap.type
                }}
          />}
        </Stack>
    )
}
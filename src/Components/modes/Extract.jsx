import { useState, useEffect } from 'react'

import Stack from "@mui/material/Stack";

import NumberSlider from '../mui/NumberSlider'

import SelectStatic from '../mui/SelectStatic'
import SmartInput from "../mui/SmartInput";
import HmapHist from '../BlockPlots/HmapHist';

import getRandomColor from '../../Functions/getRandomColor.js'
import getFetch from "../../Functions/getFetch.js";

const extractMethods = {
  ppi: 'PPI',
  nfindr: 'NFINDR'
}

const mapsMethods = {
  fcls: 'FCLS',
  ucls: 'UCLS',
  nnls: 'NNLS'
}

function Extract({urlServer, hmap, setHmap}) {
    const [extract, setExtract] = useState(null)
    
    const [methods, setMethods] = useState('ppi')
    const [map, setMap] = useState('fcls')
    const [curmap, setCurmap] = useState(0)
    const [signs, setSigns] = useState({
      spectres: [{x: 0, y: 0, color: 'blue', spectre: [], name: 'spectre', max: 0, min: 0, mean: 0, std: 0, scope: 0, iqr: 0, q1: 0, median: 0, q3: 0}],
    })

    const startExtract = async ({key, target: {value}}) => {
        if (key === 'Enter') {
          const {endmembers} = await getFetch(urlServer, 'endmembers', {name_hsi: hmap.nameHsi, method: methods, k: value})
          console.log(endmembers)

          // Заполнение спектров чтобы отразить точки на карте
          const spectres = []
          for (let i = 0; i < endmembers.length; i++) {
            if (i % 2 === 0) {
              spectres.push({x: endmembers[i], y: null, color: getRandomColor()})
            }
            else {
              spectres[spectres.length - 1]['y'] = endmembers[i]
            }
          }
          setSigns({...signs, spectres})

          const {amaps} = await getFetch(urlServer, 'amaps', {name_hsi: hmap.nameHsi, method: map, endmembers})
          console.log(amaps)
          
          setExtract(amaps)
        }
    }

    const convert2Shapes = (radius=.5) => {
      return [{
        type: 'circle',
        xref: 'x',
        yref: 'y',
        fillcolor: signs.spectres[curmap].color,
        x0: signs.spectres[curmap].x-radius,
        y0: signs.spectres[curmap].y-radius,
        x1: signs.spectres[curmap].x+radius,
        y1: signs.spectres[curmap].y+radius,
        line: {
          color: 'black'
        }
      }]
      return signs.spectres.map(spec => ({
        type: 'circle',
        xref: 'x',
        yref: 'y',
        fillcolor: spec.color,
        x0: spec.x-radius,
        y0: spec.y-radius,
        x1: spec.x+radius,
        y1: spec.y+radius,
        line: {
          color: spec.color
        }
      }))
    }
  
    return (
      <>
        <Stack direction="row" spacing={2}>
          <SelectStatic menuItems={extractMethods} value={methods} handleChange={e => setMethods(e.target.value)} title='Поиск классов'/>
          <SelectStatic menuItems={mapsMethods} value={map} handleChange={e => setMap(e.target.value)} title='Вычисление карт'/>
          <SmartInput pressChannel={startExtract} defaultValue='5' title='Количество классов'/>
          {extract && <NumberSlider min={0} max={extract.length-1} title={'Номер карты'} value={curmap} changeFunc={e => setCurmap(e.target.value)}/>}
        </Stack>

        {extract && <HmapHist 
            histProps={{hist: [{data: extract[curmap].hist, color: getRandomColor()}], bins: extract[curmap].bins, colorHist: 'lime'}}
            hmapProps={{z: extract[curmap].data, colorHmap: hmap.colormap, flagNull: false, type: hmap.type, 
              // clickFunc: async (e) => {
              //   const {x, y} = e.points[0]
              //   setCoordinates([x, y])
              // },
              shapes: convert2Shapes()
            }}
          />}
      </>
    )
  }
  
  export default Extract
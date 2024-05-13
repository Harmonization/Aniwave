import { useState, useEffect } from 'react'

import Stack from "@mui/material/Stack";

import SelectStatic from '../mui/SelectStatic'
import SmartInput from "../mui/SmartInput";
import Heatmap from '../plots/Heatmap';

const extractMethods = {
  ppi: 'PPI',
  nfindr: 'NFINDR'
}

const mapsMethods = {
  fcls: 'FCLS',
  ucls: 'UCLS',
  nnls: 'NNLS'
}

function Extract({urlServer, color}) {
    const [rgb, setRGB] = useState(null)
    const [extract, setExtract] = useState(null)
    
    const [methods, setMethods] = useState('ppi')
    const [map, setMap] = useState('fcls')
    const [curmap, setCurmap] = useState(0)

    useEffect(() => {getRGB()}, [])

    const getRGB = async () => {
        const response = await fetch(`${urlServer}rgb`)
        const {x} = await response.json()
        setRGB(x)
    }

    const startExtract = async ({key, target: {value}}) => {
        if (key === 'Enter') {
            const response = await fetch(`${urlServer}extract?k=${value}&method=${methods}&amap=${map}`)
            const result_extract = await response.json()
            setExtract(result_extract)
            console.log(result_extract)
        }
      }
  
    return (
      <>

        <Stack direction="row" spacing={2}>
          <SelectStatic menuItems={extractMethods} currentValue={methods} changeFunc={setMethods} title='Поиск классов'/>
          <SelectStatic menuItems={mapsMethods} currentValue={map} changeFunc={setMap} title='Вычисление карт'/>
          <SmartInput pressChannel={startExtract} defaultValue='5' title='Количество классов'/>
          {extract && <SelectStatic menuItems={{...extract.amaps.map((el, indx) => `Карта ${indx+1}`)}} currentValue={curmap} changeFunc={setCurmap} title='Карты изобилия'/>}
        </Stack>
        
        {extract &&  <Heatmap z={extract.amaps[curmap]} color={color}/>}

      </>
    )
  }
  
  export default Extract
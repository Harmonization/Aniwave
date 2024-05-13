import { useState, useEffect } from 'react'
import Plot from 'react-plotly.js'

import Heatmap from '../plots/Heatmap';

import SelectStatic from '../mui/SelectStatic';
import Stack from '@mui/material/Stack';

const classificationSelectItems = {
  sam: "SAM",
  sid: "SID",
  sca: "SCA",
};

function Classification({urlServer, color}) {
    const [data, setData] = useState(null)
    const [method, setMethod] = useState('sam')
    const [coordinates, setCoordinates] = useState([0, 0])
    
    useEffect(() => {
        if (!coordinates) return
        getAngleMap()
    }, [coordinates])

    const getAngleMap = async () => {
        const request = `${urlServer}classification?algorithm=${method}&x=${coordinates[0]}&y=${coordinates[1]}`
        const response = await fetch(request)
        const {x} = await response.json()
        setData(x)
    }

    const clickXY = async (e) => {
      const {x, y} = e.points[0]
      setCoordinates([x, y])
    }
  
    return (
      <>

        <Stack direction="row" spacing={2}  >

          <SelectStatic menuItems={classificationSelectItems} currentValue={method} changeFunc={setMethod} title='Метод'/>
      
          {/* <input type='text' value={`x=${coordinates[0]}, y=${coordinates[1]}`}/> */}

        </Stack>

      
        
{/* 
      {rgb && <Plot 
          data={[
            {
              z: rgb,
              type: 'image',
              hoverinfo: 'none'
            }
          ]} 
          onClick={async (e) => {
            const {x, y} = e.points[0]
            setCoordinates([x, y])
          }}

          layout={{
            width: 712, 
            height: 512,
            margin: {t: 0, b: 0, l: 0, r: 0},
            pad: {r: 10, t: 10, l: 10, b: 10},
            template: "plotly_white",
            x: 0.11,
            xanchor: "left",
            y: 1.1,
            yanchor: "top",
            showactive: true,
            title: `RGB`,
            }}
        />} */}

        {data && <Heatmap z={data} color={color} clickFunc={clickXY}/>}

      </>
    )
  }
  
  export default Classification
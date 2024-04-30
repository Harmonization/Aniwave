import { useState, useEffect } from 'react'
import Plot from 'react-plotly.js'

function Classification() {
    const [rgb, setRGB] = useState(null)
    const [data, setData] = useState(null)
    const [coordinates, setCoordinates] = useState(null)

    useEffect(() => {getRGB()}, [])

    useEffect(() => {
        if (!coordinates) return
        getAngleMap()
    }, [coordinates])

    const getRGB = async () => {
        const response = await fetch(`http://127.0.0.1:8000/rgb`)
        const {x} = await response.json()
        setRGB(x)
    }

    const getAngleMap = async () => {
        const {value} = document.querySelector('#classification_mode')
        const response = await fetch(`http://127.0.0.1:8000/classification?algorithm=${value}&x=${coordinates[0]}&y=${coordinates[1]}`)
        const {x} = await response.json()
        setData(x)
    }
  
    return (
      <>
      <form action=""></form>

        <select id='classification_mode'>
            <option value="sam">SAM</option>
            <option value="sid">SID</option>
            <option value="sca">SCA</option>
        </select>
  
      {coordinates && <input type='text' value={`x=${coordinates[0]}, y=${coordinates[1]}`}/>}
      
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
        />}
  
        {data && <Plot 
          data={[
            {
              z: data,
              type: 'heatmap'
            }
          ]} 
          
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
            title: `Channel: ${data.band}`,
            updatemenus: [
            {
              type: 'buttons',
              direction: 'top',
              buttons: [
                {
                  args: ['type', 'heatmap'],
                  label: 'Heatmap',
                  method: 'restyle'
                },
                {
                  args: ['type', 'surface'],
                  label: '3D Surface',
                  method: 'restyle'
                }
              ]
          }]}}
        />}
      </>
    )
  }
  
  export default Classification
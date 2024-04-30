import { useState, useEffect } from 'react'
import Plot from 'react-plotly.js'

function Extract() {
    const [rgb, setRGB] = useState(null)
    const [extract, setExtract] = useState(null)
    const [color, setColor] = useState('Earth')

    useEffect(() => {getRGB()}, [])

    const getRGB = async () => {
        const response = await fetch(`http://127.0.0.1:8000/rgb`)
        const {x} = await response.json()
        setRGB(x)
    }

    const startExtract = async ({key, target: {value}}) => {
        if (key === 'Enter') {
            const {value: method} = document.querySelector('#extract_mode')
            const {value: amap} = document.querySelector('#amaps_mode')
            const response = await fetch(`http://127.0.0.1:8000/extract?k=${value}&method=${method}&amap=${amap}`)
            const result_extract = await response.json()
            setExtract(result_extract)
            console.log(result_extract)
        }
      }

      const changeColor = () => {
        const {value} = document.querySelector('#colors_mode')
        setColor(value)
      }

    const colors = ['Earth','Blackbody','Bluered','Blues','Cividis','Electric','Greens','Greys','Hot','Jet','Picnic','Portland','Rainbow','RdBu','Reds','Viridis','YlGnBu','YlOrRd']
  
    return (
      <>
      <form action=""></form>

        <select id='extract_mode'>
            <option value="ppi">PPI</option>
            <option value="nfindr">NFINDR</option>
        </select>

        <select id='amaps_mode'>
            <option value="fcls">FCLS</option>
            <option value="ucls">UCLS</option>
            <option value="nnls">NNLS</option>
        </select>

        <select onChange={changeColor} id='colors_mode'>
            {colors.map(color => (<option key={color} value={color}>{color}</option>))}
        </select>

        <input type="number" placeholder='Количество классов' onKeyDown={startExtract}/>
      
      {/* RGB */}
      {rgb && <Plot 
          data={[
            {
              z: rgb,
              type: 'image'
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
            title: `RGB`,
            }}
        />}
  
  
        {/* Карты изобилия */}
        {extract && extract.amaps.map((amap, indx) => (<Plot 
        key={indx}
          data={[
            {
              z: amap,
              type: 'heatmap',
              colorscale: color
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
        />))}
      </>
    )
  }
  
  export default Extract
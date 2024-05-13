import { useState, useEffect } from 'react'
import { useLoaderData } from 'react-router-dom'

import Lumen from './modes/Lumen.jsx'
import Statistics from './modes/Statistics.jsx'
import Classification from './modes/Classification.jsx'
import Clusterization from './modes/Clusterization.jsx'
import Extract from './modes/Extract.jsx'

import Rgb from './plots/Rgb.jsx'

import Stack from "@mui/material/Stack";

import CustomizedAccordions from './mui/PreloadHiddenText.jsx'
import MenuButtons from './mui/MenuButtons.jsx'
import SelectStatic from './mui/SelectStatic.jsx'
import HiddenImage from './mui/HiddenImage.jsx'

const colors = [
  'Earth',
  'Blackbody',
  'Bluered',
  'Blues',
  'Cividis',
  'Electric',
  'Greens',
  'Greys',
  'Hot',
  'Jet',
  'Picnic',
  'Portland',
  'Rainbow',
  'RdBu',
  'Reds',
  'Viridis',
  'YlGnBu',
  'YlOrRd'
]

const colorsDict = Object.assign({}, ...Object.entries({...colors}).map(([a,b]) => ({ [b]: b })))

const urlMode = 'dev'
const urlServer = urlMode == 'dev' ? import.meta.env.VITE_URL_DEV : import.meta.env.VITE_URL_DEPLOY

function Menu() {
  const [point, setPoint] = useState(1)
  const [color, setColor] = useState('Rainbow')
  const [rgb, setRgb] = useState(null)

  const { paths, files } = useLoaderData()
  const filesDict = {...files.map(el => `${el}`)}

  // Пункты меню и соответствующие компоненты
  const menu = [
    <Lumen key='menu-el-1' urlServer={urlServer} color={color}/>,
    <Statistics key='menu-el-3' urlServer={urlServer} color={color}/>,
    null,
    <Classification key='menu-el-2' urlServer={urlServer} color={color} />,
    <Extract key='menu-el-5' urlServer={urlServer} color={color}/>,
    <Clusterization key='menu-el-6' urlServer={urlServer} color={color}/>
  ]

  const loadFile = async value => {
    // Загрузить выбранный файл с сервера
    if (!value) return

    const path = paths[value]['path']
    const request = `${urlServer}download?path=${path}`

    const response = await fetch(request)
    const fileinfo = await response.json()
    setRgb(fileinfo.rgb)
    console.log(fileinfo)
  }

  return (
    <div className="page">

      <div className="menu" >

        <Stack direction="row" spacing={2}>

          <SelectStatic menuItems={filesDict} currentValue={''} changeFunc={loadFile} title='HSI' nullElem={true}/>

          <SelectStatic menuItems={colorsDict} currentValue={color} changeFunc={setColor} title='Раскраска'/>

          <HiddenImage component={rgb && <Rgb rgb={rgb} />} title='Цветное изображение'/>

        </Stack>

        <MenuButtons setPoint={setPoint}/>

      </div>

      <CustomizedAccordions indxSection={point-1}></CustomizedAccordions>

      <div className="plots">
        {menu.map((item, indx) => (point == indx+1 && item))}
      </div>
      
    </div>
  )
}

export default Menu

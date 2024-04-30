import { useState, useEffect } from 'react'
import Lumen from './modes/Lumen.jsx'
import Classification from './modes/Classification.jsx'
import Clusterization from './modes/Clusterization.jsx'
import Extract from './modes/Extract.jsx'

const token = import.meta.env.VITE_YD_TOKEN
const body = 'https://cloud-api.yandex.net/v1/disk/resources'
const main_root = 'Datasets and Program/HSI and TIR/Aniwave'

function Menu() {
  const [point, setPoint] = useState(1)
  const [files, setFiles] = useState(null)
  const [paths, setPaths] = useState(null)
  const menuChange = ({target: {value}}) => {
    setPoint(value)
  }

  const getFiles = async () => {
    const response = await fetch(`${body}?path=${main_root}&fields=name,_embedded.items.path`, {
    headers: {Authorization: `OAuth ${token}`}
    })
    const {_embedded: {items}} = await response.json()
    
    const paths = items.filter(({path}) => path.includes('.npy'))
    const files = paths.map(({path}) => path.split('/').slice(-1)[0])
    setFiles(files)
    setPaths(paths)
    console.log(paths)
  }

  const loadFile = async () => {
    const {value} = document.querySelector("#select_files")
    const path = paths[value]['path']
    const response = await fetch(`http://127.0.0.1:8000/download?path=${path}`)
    const result_download = await response.json()
    console.log(result_download)
  }

  return (
    <div className="menu" >
      <button onClick={getFiles}>Открыть HSI</button>
      {files && <select onChange={loadFile} name="" id="select_files">
        {files.map((file, indx) => <option key={indx} value={indx}>{file}</option>)}
      </select>}

      {point != 1 && <button value={1} onClick={menuChange}>Визуализация HSI</button>}
      {point != 2 && <button value={2} onClick={menuChange}>Классификация</button>}
      {point != 3 && <button value={3} onClick={menuChange}>Предобработка</button>}
      {point != 4 && <button value={4} onClick={menuChange}>Обработка ROI</button>}
      {point != 5 && <button value={5} onClick={menuChange}>Визуализация TIR</button>}
      {point != 6 && <button value={6} onClick={menuChange}>Извлечение</button>}
      {point != 7 && <button value={7} onClick={menuChange}>Кластеризация</button>}
      
      {point == 1 && <Lumen/>}
      {point == 2 && <Classification/>}
      {point == 6 && <Extract/>}
      {point == 7 && <Clusterization/>}
    </div>
  )
}

export default Menu

import { useState, useEffect } from 'react'

import HmapHist from '../BlockPlots/HmapHist';

import Stack from '@mui/material/Stack';
import SelectStatic from '../mui/SelectStatic';
import SmartInput from "../mui/SmartInput";
import NumberSlider from '../mui/NumberSlider'

import getFetch from "../../Functions/getFetch.js";
import getRandomColor from '../../Functions/getRandomColor.js'

const classificationSelectItems = {
  sam: "SAM",
  sid: "SID",
  sca: "SCA",
};

const clusterMethods = {
  ppi: 'PPI',
  nfindr: 'NFINDR',
  kmeans: "KMeans",
  affinity_propagation: "AffinityPropagation (долго)",
  optics: "OPTICS (долго)",
  birch: "Birch",
  spectral_clustering: "SpectralClustering (не сразу)",
  mini_batch_kmeans: "MiniBatchKMeans",
  agglomerative_clustering: "AgglomerativeClustering (не сразу)",
  gaussian_mixture: "GaussianMixture (не сразу)"
}

const mapsMethods = {
  fcls: 'FCLS',
  ucls: 'UCLS',
  nnls: 'NNLS'
}

function Classification({urlServer, hmap, setHmap}) {
    const [method, setMethod] = useState('sam')
    const [coordinates, setCoordinates] = useState([0, 0])
    const [curmap, setCurmap] = useState(0)
    const [signs, setSigns] = useState({
      spectres: [{x: 0, y: 0, color: 'blue', spectre: [], name: 'spectre', max: 0, min: 0, mean: 0, std: 0, scope: 0, iqr: 0, q1: 0, median: 0, q3: 0}],
    })
    const [map, setMap] = useState('fcls')
    const [extract, setExtract] = useState([])
    
    useEffect(() => {
      if (!coordinates) return
      getAngleMap()
    }, [coordinates])

    const getAngleMap = async () => {
      const {segmentation, hist, bins} = await getFetch(urlServer, 'classes', {name_hsi: hmap.nameHsi, method, x: coordinates[0], y: coordinates[1]})
      setHmap({...hmap, channel: segmentation, expression: method, hist, bins})

      setExtract([...extract, {data: segmentation, hist, bins}])
      // setCurmap(extract.length-1)
    }
    console.log(extract)

    const startClasterization = async e => {
      if (e.key === 'Enter') {
        if (hmap.expression === 'ppi' || hmap.expression === 'nfindr') {
          const {endmembers} = await getFetch(urlServer, 'endmembers', {name_hsi: hmap.nameHsi, k: e.target.value, method: hmap.expression})

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
          setExtract([...extract, ...amaps])
          setHmap({...hmap, channel: amaps[0].data, hist: amaps[0].hist, bins: amaps[0].bins})
        }
        else {
          const {segmentation, hist, bins} = await getFetch(urlServer, 'clusters', {name_hsi: hmap.nameHsi, k: e.target.value, method: hmap.expression})
          setHmap({...hmap, channel: segmentation, hist, bins})
          setExtract([...extract, {data: segmentation, hist, bins}])
        }
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
    }
  
    return (
      <>
        <Stack direction="row" spacing={2}>

          <SelectStatic menuItems={classificationSelectItems} value={method} handleChange={e => setMethod(e.target.value)} title='Метод'/>
          <SelectStatic menuItems={clusterMethods} value={hmap.expression} handleChange={e => setHmap({...hmap, expression: e.target.value})} title='Кластеризация'/>
          <SmartInput pressChannel={startClasterization} defaultValue='5' title='Количество классов'/>
          <NumberSlider min={0} max={signs.spectres.length-1} title={'Номер карты'} value={curmap} changeFunc={e => setCurmap(e.target.value)}/>
        </Stack>

        {extract.length !== 0 && <HmapHist 
            histProps={{hist: [{data: hmap.hist, color: getRandomColor()}], bins: hmap.bins, colorHist: 'lime'}}
            hmapProps={{z: hmap.channel, colorHmap: hmap.colormap, flagNull: true, type: hmap.type, 
              clickFunc: async (e) => {
                const {x, y} = e.points[0]
                setCoordinates([x, y])
                setSigns({...signs, spectres: [...signs.spectres, {x, y, color: getRandomColor()}]})
              },
              shapes: convert2Shapes()
            }}
          />}

      </>
    )
  }
  
  export default Classification
import { useState, useEffect } from 'react'

import Stack from "@mui/material/Stack";

import SelectStatic from '../mui/SelectStatic'
import SmartInput from "../mui/SmartInput";

import Heatmap from '../plots/Heatmap';

const clusterMethods = {
  kmeans: "KMeans",
  affinity_propagation: "AffinityPropagation (долго)",
  optics: "OPTICS (долго)",
  birch: "Birch",
  spectral_clustering: "SpectralClustering (не сразу)",
  mini_batch_kmeans: "MiniBatchKMeans",
  agglomerative_clustering: "AgglomerativeClustering (не сразу)",
  gaussian_mixture: "GaussianMixture (не сразу)"
}

function Clusterization({urlServer, color}) {
    const [clusters, setClusters] = useState(null)
    const [method, setMethod] = useState('kmeans')

    const startClasterization = async ({key, target: {value}}) => {
        if (key === 'Enter') {
            const response = await fetch(`${urlServer}clusterization?k=${value}&method=${method}`)
            const result_clusters = await response.json()
            setClusters(result_clusters)
            console.log(result_clusters)
        }
      }
  
    return (
      <>

        <Stack direction="row" spacing={2}>
          <SelectStatic menuItems={clusterMethods} currentValue={method} changeFunc={setMethod} title='Кластеризация'/>
          <SmartInput pressChannel={startClasterization} defaultValue='5' title='Количество классов'/>
        </Stack>

      {clusters && <Heatmap z={clusters.classes} color={color}/>}
      
      </>
    )
  }
  
  export default Clusterization
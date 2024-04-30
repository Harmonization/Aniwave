import { useState, useEffect } from 'react'
import Plot from 'react-plotly.js'

function Clusterization() {
    const [rgb, setRGB] = useState(null)
    const [clusters, setClusters] = useState(null)

    useEffect(() => {getRGB()}, [])

    const getRGB = async () => {
        const response = await fetch(`http://127.0.0.1:8000/rgb`)
        const {x} = await response.json()
        setRGB(x)
    }

    const startClasterization = async ({key, target: {value}}) => {
        if (key === 'Enter') {
            const {value: method} = document.querySelector('#clasterization_mode')
            const response = await fetch(`http://127.0.0.1:8000/clusterization?k=${value}&method=${method}`)
            const result_clusters = await response.json()
            setClusters(result_clusters)
            console.log(result_clusters)
        }
      }
  
    return (
      <>
      <form action=""></form>

        <select id='clasterization_mode'>
            <option value="kmeans">KMeans</option>
            {/* <option value="dbscan">DBSCAN</option> */}
            <option value="affinity_propagation">AffinityPropagation (долго)</option>
            <option value="optics">OPTICS (долго)</option>
            <option value="birch">Birch</option>
            <option value="spectral_clustering">SpectralClustering (не сразу)</option>
            <option value="mini_batch_kmeans">MiniBatchKMeans</option>
            <option value="agglomerative_clustering">AgglomerativeClustering (не сразу)</option>
            <option value="gaussian_mixture">GaussianMixture (не сразу)</option>
        </select>

        <input type="number" placeholder='Количество классов' onKeyDown={startClasterization}/>
      
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
  
        {/* Кластеры в виде классов */}
        {clusters && <Plot 
          data={[
            {
              z: clusters.classes,
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
  
  export default Clusterization
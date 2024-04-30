import { useState, useEffect } from 'react'
import Plot from 'react-plotly.js'

function Lumen() {
  const [data, setData] = useState(null)
  const [spectreStat, setSpectreStat] = useState(0)
  const [nm, setNm] = useState(0)
  const [stat, setStat] = useState(0)
  const [channelsStat, setChannelsStat] = useState(0)

  const getStat = async () => {
    const response = await fetch(`http://127.0.0.1:8000/stat`)
    const statistics = await response.json()
    setStat(statistics)
    console.log(statistics)
  }

  const getBand = async (expr) => {
    const response = await fetch(`http://127.0.0.1:8000/bands/${expr}`)
    const {x} = await response.json()
    setData(x)
  }

  const pressChannel = async ({key, target: {value}}) => {
    if (key === 'Enter') {
      getBand(value)
    }
  }

  const getSpectre = async (x, y) => {
    const response = await fetch(`http://127.0.0.1:8000/spectre?x=${x}&y=${y}`)
    const statistics = await response.json()
    setSpectreStat(statistics)
    setNm(statistics.nm)
  }

  const getRegression = async (x, y) => {
    console.log('sff')
    const response = await fetch(`http://127.0.0.1:8000/stat/regression?b1=${x}&b2=${y}`)
    const statistics = await response.json()
    setChannelsStat(statistics)
    console.log(statistics)
  }

  return (
    <>
    <form action=""></form>

    <button onClick={getBand}>Загрузить канал</button>

    <input type='text' onKeyDown={pressChannel}/>

    <div className='graphs'>
    </div>

      {data && <Plot 
        data={[
          {
            z: data,
            type: 'heatmap'
          }
        ]} 
        onClick={async (e) => {
          const {x, y} = e.points[0]
          await getSpectre(x, y)
        }
          
        }
        layout={{
          width: 800, 
          height: 600,
          margin: {t: 0, b: 30, l: 0, r: 0},
          pad: {r: 10, t: 10, l: 10, b: 10},
          template: "plotly_white",
          x: 0.11,
          xanchor: "left",
          y: 1.1,
          yanchor: "top",
          showactive: true,
          // title: `Channel: ${data.band}`,
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

      {data && <Plot
        data ={[
          {
            x: nm,
            y: spectreStat.spectre,
            type: 'lineplot',
            name: 'fsdf'
          }
        ]}
        layout={{
          width: 700, 
          height: 600, 
          title: `</br>Спектральная сигнатура</br>Max: ${spectreStat.max_spectre}, Min: ${spectreStat.min_spectre}, Mean: ${spectreStat.mean_spectre}, Std: ${spectreStat.std_spectre}</br>Scope: ${spectreStat.scope_spectre}, IQR: ${spectreStat.iqr_spectre}</br> Quartile 1: ${spectreStat.q1_spectre}, Median: ${spectreStat.median_spectre}, Quartile 3: ${spectreStat.q3_spectre}`, 
          xaxis: {
          title: 'nm'
          },
          yaxis: {
          title: 'reflectance'
          }}}
      />}

{data && <Plot
        data ={[
          {
            x: nm,
            y: spectreStat.derivative,
            type: 'lineplot'
          }
        ]}
        layout={{
          width: 500, 
          height: 500, 
          title: `</br>Производная спектра</br>Max: ${spectreStat.max_deriv}, Min: ${spectreStat.min_deriv}, Mean: ${spectreStat.mean_deriv}, Std: ${spectreStat.std_deriv}</br>Scope: ${spectreStat.scope_deriv}, IQR: ${spectreStat.iqr_deriv}</br> Quartile 1: ${spectreStat.q1_deriv}, Median: ${spectreStat.median_deriv}, Quartile 3: ${spectreStat.q3_deriv}`,
          xaxis: {
            title: 'nm'
          },
          yaxis: {
            title: 'derivative'
          }}}
      />}

    {data && <Plot
        data ={[
          {
            x: [].concat(...data),
            type: 'histogram'
          }
        ]}
        layout={{
          width: 500, 
          height: 500, 
          title: 'Гистограмма',
          xaxis: {
            title: 'reflectance'
            },
            yaxis: {
            title: 'count'
            }}}
      />}

      <button onClick={getStat}>Получить статистику</button>

      {stat && <label htmlFor="stat">Статистика по HSI: </label>}
      {stat && <textarea readOnly id="stat" cols="15" rows="10" value={`Max: ${stat.max_hsi}\nMin: ${stat.min_hsi}\nMean: ${stat.mean_hsi}\nStd: ${stat.std_hsi}\nScope: ${stat.scope_hsi}\nIQR: ${stat.iqr_hsi}\nEntropy: ${stat.entropy_hsi}\nQuartile 1: ${stat.q1_hsi}\nMedian: ${stat.median_hsi}\nQuartile 3: ${stat.q3_hsi}`}></textarea>}

      {stat && <Plot 
        data={[
          {
            z: stat.hsi_matrix_correlation,
            type: 'heatmap'
          }
        ]} 
        onClick={async (e) => {
          const {x, y} = e.points[0]
          console.log(x, y)
          await getRegression(x, y)
        }
          
        }
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
          title: 'Матрица корреляции каналов',
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

    {channelsStat && <Plot
        data ={[
          {
            x: channelsStat.x,
            y: channelsStat.y,
            mode: 'lines',
            type: 'lineplot',
            name: `${channelsStat.a} * x + ${channelsStat.b}`
          },
          {
            x: channelsStat.points_1,
            y: channelsStat.points_2,
            mode: 'markers',
            type: 'scatter',
            name: `</br>Облако точек</br>Корреляция: ${channelsStat.correlation}</br>Детерминация: ${channelsStat.determination}</br>Эластичность: ${channelsStat.elastic}</br>Бета: ${channelsStat.beta}`
          },
        ]}
        layout={{
          width: 700, 
          height: 600, 
          title: `Регрессия между каналами`,
          xaxis: {
            title: `Канал ${channelsStat.b1}`
          },
          yaxis: {
            title: `Канал ${channelsStat.b2}`
          }}}
      />}

      {stat && <Plot
        data ={[
          {
            x: nm,
            y: stat['max_bands'],
            type: 'lineplot'
          }
        ]}
        layout={{width: 500, height: 500, title: 'Максимум по каналам'}}
      />}

      {stat && <Plot
        data ={[
          {
            x: nm,
            y: stat['min_bands'],
            type: 'lineplot'
          }
        ]}
        layout={{width: 500, height: 500, title: 'Минимум по каналам'}}
      />}

    {stat && <Plot
        data ={[
          {
            x: nm,
            y: stat['mean_bands'],
            type: 'lineplot'
          }
        ]}
        layout={{width: 500, height: 500, title: 'Среднее по каналам'}}
      />}

    {stat && <Plot
        data ={[
          {
            x: nm,
            y: stat['std_bands'],
            type: 'lineplot'
          }
        ]}
        layout={{width: 500, height: 500, title: 'Среднекв. отклонение'}}
        />}

        {stat && <Plot
          data ={[
            {
              x: nm,
              y: stat['scope_bands'],
              type: 'lineplot'
            }
          ]}
          layout={{width: 500, height: 500, title: 'Размах по каналам'}}
      />}

    {stat && <Plot
          data ={[
            {
              x: nm,
              y: stat['iqr_bands'],
              type: 'lineplot'
            }
          ]}
          layout={{width: 500, height: 500, title: 'Межквартильный. размах'}}
      />}

    {stat && <Plot
          data ={[
            {
              x: nm,
              y: stat['entropy_bands'],
              type: 'lineplot'
            }
          ]}
          layout={{width: 500, height: 500, title: 'Энтропия по каналам'}}
      />}

    {stat && <Plot
          data ={[
            {
              x: nm,
              y: stat['q1_bands'],
              type: 'lineplot'
            }
          ]}
          layout={{width: 500, height: 500, title: '1 квартиль по каналам'}}
      />}

{stat && <Plot
          data ={[
            {
              x: nm,
              y: stat['median_bands'],
              type: 'lineplot'
            }
          ]}
          layout={{width: 500, height: 500, title: 'Медиана по каналам'}}
      />}

{stat && <Plot
          data ={[
            {
              x: nm,
              y: stat['q3_bands'],
              type: 'lineplot'
            }
          ]}
          layout={{width: 500, height: 500, title: '3 квартиль по каналам'}}
      />}
    </>
  )
}

export default Lumen

import Plot from 'react-plotly.js'

export default function Heatmap({z, clickFunc, width=700, height=500, color='Earth', flagNull=false}) {
    const data_with_null = z.map(row => row.map(value => value != 0 ? value : null))

    return (
      <div className="heatmap-item">
        <Plot 
          data={[
            {
              z: flagNull ? data_with_null : z,
              type: 'heatmap',
              colorscale: color
            }
          ]} 
          onClick={async e => clickFunc(e)}
          layout={{
            xaxis: {
              ticks: '',
              showticklabels: false
            },
            yaxis: {
              ticks: '',
              showticklabels: false,
            },
            // xaxis: {
            //   ticks: '',
            //   showticklabels: false
            // },
            // yaxis: {
            //   ticks: '',
            //   showticklabels: false,
            // },
            width: width, 
            height: height,
            margin: {t: 0, b: 30, l: 0, r: 0},
            template: "plotly_white",
            x: 0.11,
            xanchor: "left",
            y: 1.1,
            yanchor: "top",
            showactive: true,
            paper_bgcolor: 'rgba(119, 204, 247, .01)',
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
        />
      </div>
    )
  }
  
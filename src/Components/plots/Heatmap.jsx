
import Plot from 'react-plotly.js'

export default function Heatmap({z, clickFunc, width=600, height=500, color='Earth', flagNull=false, type='heatmap', shapes=[], correlation=false, x_title=''}) {
    const data_with_null = z.map(row => row.map(value => value != 0 ? value : null))

    return (
      <div className="heatmap-item">
        <Plot 
          data={[
            {
              z: flagNull ? data_with_null : z,
              type: type,
              colorscale: color,
              zsmooth: !correlation ? 'fast' : undefined,
            }
          ]} 
          onClick={async e => clickFunc(e)}
          layout={{
            xaxis: {
              ticks: '',
              showticklabels: correlation,
              showgrid: false,
              title: x_title
            },
            yaxis: {
              ticks: '',
              showticklabels: false,
              showgrid: false
            },
            shapes: type==='heatmap' ? shapes : undefined,
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
            plot_bgcolor: 'rgba(119, 204, 247, .01)'
        }}
        />
      </div>
    )
  }
  

import Plot from 'react-plotly.js'

export default function Lineplot({x, y, title='', xlabel='', ylabel='', width=350, height=350}) {
    return (
      <div className="plot-item">
        <Plot
            data ={[
              {
                x: x,
                y: y,
                type: 'lineplot',
                line: {
                  width: 3,
                  color: 'coral'
                }
              }
            ]}
            layout={{
              margin: {t: 30, b: 30, l: 50, r: 30},
              title: title, 
              // paper_bgcolor: 'rgb(253, 216, 254)', 
              // plot_bgcolor: 'rgb(253, 216, 254)', 
              paper_bgcolor: 'rgba(119, 204, 247, .01)', 
              plot_bgcolor: 'rgba(119, 204, 247, .01)',
              width: width, 
              height: height,
              xaxis: {
                title: xlabel
              },
              yaxis: {
                title: ylabel
              }
            }}
        />
      </div>
    )
  }
import Plot from 'react-plotly.js'

export default function Histogram({data, title='', width=500, height=500}) {
    return (
      <div className="histogram-item">
        <Plot
            data ={[
              {
                x: [].concat(...data),
                type: 'histogram'
              }
            ]}
            layout={{
              colorway: ['coral'],
              width: width, 
              height: height,
              margin: {t: 30, b: 30, l: 50, r: 30},
              paper_bgcolor: 'rgba(119, 204, 247, .01)', 
              plot_bgcolor: 'rgba(119, 204, 247, .01)',
              title: title,
              xaxis: {
                title: 'reflectance'
                },
                yaxis: {
                title: 'count'
                }}}
          />
      </div>
    )
  }
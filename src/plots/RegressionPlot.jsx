import Plot from 'react-plotly.js'

export default function RegressionPlot({line_x, line_y, point_x, point_y, line_name='', 
                        point_name='', xlabel='', ylabel='', title='', width=600, height=400}) {
  return (
    <Plot
        data ={[
          {
            x: line_x,
            y: line_y,
            mode: 'lines',
            type: 'lineplot',
            name: line_name,
            line: {
              width: 3,
              color: 'black'
            }
          },
          {
            x: point_x,
            y: point_y,
            mode: 'markers',
            type: 'scatter',
            name: point_name,
            marker: {
              color: 'coral',
              size: 5
            }
          },
        ]}
        layout={{
          width: width, 
          height: height,
          margin: {t: 30, b: 30, l: 50, r: 30}, 
          title: title,
          paper_bgcolor: 'rgba(119, 204, 247, .01)', 
          plot_bgcolor: 'rgba(119, 204, 247, .01)', 
          xaxis: {
            title: xlabel
          },
          yaxis: {
            title: ylabel
          }}}
      />
  )
}
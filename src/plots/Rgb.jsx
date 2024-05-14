import Plot from 'react-plotly.js'

export default function Rgb({rgb, clickFunc, width=750, height=450}) {
    return (
        <Plot 
          data={[
            {
              z: rgb,
              type: 'image',
              hoverinfo: 'none'
            }
          ]} 
          onClick={clickFunc}
          
          layout={{
            xaxis: {
              ticks: '',
              showticklabels: false
            },
            yaxis: {
              ticks: '',
              showticklabels: false
            },
            width: width, 
            height: height,
            margin: {t: 0, b: 0, l: 0, r: 370},
            template: "plotly_white",
            x: 0.11,
            xanchor: "left",
            y: 1.1,
            yanchor: "top",
            showactive: true,
            paper_bgcolor: 'rgba(119, 204, 247, .01)'
            }}
        />
    )
}
import { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";

import Stack from "@mui/material/Stack";

import RadioButtonsGroup from "../mui/RadioButtonsGroup";
import SmartInput from "../mui/SmartInput";

import Lineplot from "../plots/Lineplot";
import Heatmap from "../plots/Heatmap";
import Histogram from "../plots/Histogram";

const inputStory = [
  'b70',
  'b203',
  'b150 + sin(b140)',
  'b100 - b40',
  'b30 * b60'
]

function Lumen({ urlServer, color }) {
  const [channel, setChannel] = useState(null); // Канал
  const [spectreStat, setSpectreStat] = useState(0); // Статистика спектра, производной
  const [plot, setPlot] = useState("hist"); // (str) Выбранный график (спектр, производная, гистограмма)

  const { nm } = useLoaderData();

  const getChannel = async (expr) => {
    const response = await fetch(`${urlServer}bands/${expr}`);
    const { spectral_index } = await response.json();
    setChannel(spectral_index);
  };

  const pressChannel = async ({ key, target: { value } }) => {
    if (key === "Enter") {
      getChannel(value);
    }
  };

  const getSpectre = async (x, y) => {
    const response = await fetch(`${urlServer}spectre?x=${x}&y=${y}`);
    const statistics = await response.json();
    setSpectreStat(statistics);
  };

  return (
    <>

      <div className="panel">
        <Stack direction="row" spacing={2}>
          <RadioButtonsGroup setPlot={setPlot} />

          <SmartInput pressChannel={pressChannel} story={inputStory}/>
        </Stack>
      </div>

      {channel && (
        <div className="smart-heatmap">
          <div className="hsi-plots">
            {plot == "sign" && (
              <Lineplot
                x={nm}
                y={spectreStat.spectre}
                xlabel="nm"
                ylabel="reflectance"
                width={500}
                height={450}
                title={`</br>Max: ${spectreStat.max_spectre}, Min: ${spectreStat.min_spectre}, Mean: ${spectreStat.mean_spectre}, Std: ${spectreStat.std_spectre}</br>Scope: ${spectreStat.scope_spectre}, IQR: ${spectreStat.iqr_spectre}</br> Quartile 1: ${spectreStat.q1_spectre}, Median: ${spectreStat.median_spectre}, Quartile 3: ${spectreStat.q3_spectre}`}
              />
            )}

            {plot == "der" && (
              <Lineplot
                x={nm}
                y={spectreStat.derivative}
                xlabel="nm"
                ylabel="derivative"
                width={500}
                height={450}
                title={`</br>Max: ${spectreStat.max_deriv}, Min: ${spectreStat.min_deriv}, Mean: ${spectreStat.mean_deriv}, Std: ${spectreStat.std_deriv}</br>Scope: ${spectreStat.scope_deriv}, IQR: ${spectreStat.iqr_deriv}</br> Quartile 1: ${spectreStat.q1_deriv}, Median: ${spectreStat.median_deriv}, Quartile 3: ${spectreStat.q3_deriv}`}
              />
            )}

            {plot == "hist" && (
              <Histogram
                data={channel}
                title={`</br>Max: ${spectreStat.max_hsi}, Min: ${spectreStat.min_hsi}, Mean: ${spectreStat.mean_hsi}, Std: ${spectreStat.std_hsi}</br>Scope: ${spectreStat.scope_hsi}, IQR: ${spectreStat.iqr_hsi}, Entropy: ${spectreStat.entropy_hsi}</br>Quartile 1: ${spectreStat.q1_hsi}, Median: ${spectreStat.median_hsi}, Quartile 3: ${spectreStat.q3_hsi}`}
              />
            )}
          </div>

          <Heatmap
            z={channel}
            clickFunc={async (e) => {
              const { x, y } = e.points[0];
              await getSpectre(x, y);
            }}
            color={color}
          />
        </div>
      )}

      
    </>
  );
}

export default Lumen;

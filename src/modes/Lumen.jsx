import { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import * as XLSX from "xlsx"

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
  const [statIndx, setStatIndx] = useState(null) // Статистика гистограммы
  const [spectreStat, setSpectreStat] = useState(0); // Статистика спектра, производной
  const [plot, setPlot] = useState("hist"); // (str) Выбранный график (спектр, производная, гистограмма)

  const { nm } = useLoaderData();

  const getChannel = async (expr) => {
    const response = await fetch(`${urlServer}bands/${expr}`);
    const { spectral_index, stat_index } = await response.json();
    setChannel(spectral_index);
    setStatIndx(stat_index)
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

  const saveSpectre2Xlsx = () => {
    const dataaa = spectreStat.spectre.map((val, indx) => ({band: indx, nm: nm[indx], value: val, derivative: spectreStat.derivative[indx]}))

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(dataaa)
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1')
    XLSX.writeFile(wb, 'table.xlsx')
  }

  const pressEnterSave = (e) => {
    if (e.key == 'Enter' && spectreStat.spectre && spectreStat.derivative) {
      saveSpectre2Xlsx()
    }
  }

  return (
    <>

      <div className="panel">
        <Stack direction="row" spacing={2}>
          <RadioButtonsGroup setPlot={setPlot} pressDownFunc={pressEnterSave}/>

          <SmartInput pressChannel={pressChannel} blurFunc={getChannel} story={inputStory}/>

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
                title={`</br>Max: ${statIndx.max}, Min: ${statIndx.min}, Mean: ${statIndx.mean}, Std: ${statIndx.std}</br>Scope: ${statIndx.scope}, IQR: ${statIndx.iqr}, Entropy: ${statIndx.entropy}</br>Quartile 1: ${statIndx.q1}, Median: ${statIndx.median}, Quartile 3: ${statIndx.q3}`}
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
            flagNull={true}
          />
        </div>
      )}

      
    </>
  );
}

export default Lumen;

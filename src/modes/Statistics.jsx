import { useState, useEffect } from 'react'
import { useLoaderData } from "react-router-dom";

import SelectStatic from "../mui/SelectStatic";

import { Stack } from '@mui/material';

import Lineplot from "../plots/Lineplot";
import Heatmap from "../plots/Heatmap";
import RegressionPlot from "../plots/RegressionPlot";

const statSelectItems = {
    regression: "Регрессия между каналами",
    max: "Максимум по каналам",
    min: "Минимум по каналам",
    mean: "Среднее по каналам",
    std: "Среднекв. отклонение",
    scope: "Размах по каналам",
    iqr: "Межквартильный размах",
    entropy: "Энтропия по каналам",
    q1: "1 квартиль по каналам",
    median: "Медиана по каналам",
    q3: "3 квартиль по каналам",
  };

const statMxSelectItems = {
  matrix_correlation: "Корреляция",
  max: "Максимум",
  min: "Минимум",
  mean: "Среднее",
  std: "Среднекв. отклонение",
  scope: "Размах",
  iqr: "Межквартильный размах",
  entropy: "Энтропия",
  q1: "1 квартиль",
  median: "Медиана",
  q3: "3 квартиль",
}

export default function Statistics({urlServer, color}) {
    const [statPlot, setStatPlot] = useState(null); // (str) Выбранный стат график
    const [statMxPlot, setStatMxPlot] = useState(null); // (str) Выбранный стат график матрицы
    const [statBand, setStatBand] = useState(null); // Данные статистики (каналы)
    // const [statBandMx, setStatBandMx] = useState(null) // Данные статистики (матрицы)
    const [correlation, setCorrelation] = useState(null); // Матрица корреляции (или Данные статистики (матрицы))

    const { nm } = useLoaderData();

    useEffect(() => {
        if (!correlation) {
          const func = async () => {
            const request = `${urlServer}stat/matrix_correlation?mode=band`;
            const response = await fetch(request);
            const mxCorr = await response.json();
            setCorrelation(mxCorr);
            // console.log(mxCorr);
          };
          func();
        }
      }, []);

    const getStat = async (name, b1, b2) => {
        // Получить статистику
    
        let request = `${urlServer}stat/${name}?mode=band`;
        if (name == "regression") {
          request = `${urlServer}stat/${name}?b1=${b1}&b2=${b2}`;
        }
        const response = await fetch(request);
        const statBand = await response.json();
        setStatBand(statBand);
        setStatPlot(name);
      };

      const getStatMx = async (name) => {
        let request = `${urlServer}stat/${name}?mode=matrix`;
        const response = await fetch(request);
        const result = await response.json();
        setCorrelation(result)
        // console.log(result)
      }

    return (
      <>
        <Stack direction={'row'} spacing={10}>

          <SelectStatic
            menuItems={statSelectItems}
            currentValue={statPlot}
            changeFunc={getStat}
          />

          <SelectStatic
            menuItems={statMxSelectItems}
            currentValue={statMxPlot}
            changeFunc={getStatMx}
            title='Матрицы'
          />

        </Stack>

        

        <div className="stat">
          <div className="stat-plot-1">
            {statBand && statPlot == "regression" && (
              <RegressionPlot
                line_x={statBand.x}
                line_y={statBand.y}
                point_x={statBand.points_1}
                point_y={statBand.points_2}
                line_name={`${statBand.a} * x + ${statBand.b}`}
                point_name={`</br>Облако точек</br>Корреляция: ${statBand.correlation}</br>Детерминация: ${statBand.determination}</br>Эластичность: ${statBand.elastic}</br>Бета: ${statBand.beta}`}
                xlabel={`Канал ${statBand.b1} (${nm[statBand.b1]} nm)`}
                ylabel={`Канал ${statBand.b2} (${nm[statBand.b2]} nm)`}
              />
            )}

            {statBand && statPlot != "regression" && (
              <Lineplot x={nm} y={statBand} width={500} height={450} />
            )}
          </div>

          {correlation && (
            <Heatmap
              z={correlation}
              clickFunc={async (e) => {
                const { x, y } = e.points[0];
                console.log(x, y);
                await getStat("regression", x, y);
              }}
              width={600}
              height={450}
              color={color}
            />
          )}
        </div>
      </>
    );
}
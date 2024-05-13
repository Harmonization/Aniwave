import { useState, useEffect } from 'react'
import { useLoaderData } from "react-router-dom";

import SelectStatic from "../mui/SelectStatic";

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

export default function Statistics({urlServer, color}) {
    const [statPlot, setStatPlot] = useState(null); // (str) Выбранный стат график
    const [statBand, setStatBand] = useState(null); // Данные статистики
    const [correlation, setCorrelation] = useState(null); // Матрица корреляции

    const { nm } = useLoaderData();

    useEffect(() => {
        if (!correlation) {
          const func = async () => {
            const request = `${urlServer}stat/matrix_correlation?mode=band`;
            const response = await fetch(request);
            const mxCorr = await response.json();
            setCorrelation(mxCorr);
            console.log(mxCorr);
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

    return (
      <>
        <SelectStatic
          menuItems={statSelectItems}
          currentValue={statPlot}
          changeFunc={getStat}
        />

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
                xlabel={`Канал ${statBand.b1}`}
                ylabel={`Канал ${statBand.b2}`}
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
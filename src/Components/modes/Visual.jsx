import { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import * as XLSX from "xlsx"

import Stack from "@mui/material/Stack";

import SmartInput from "../mui/SmartInput.jsx";
import SelectStatic from "../mui/SelectStatic.jsx";
import IconMenu from "../mui/IconMenu.jsx";
import Track from "../mui/Track";

import HmapHist from '../BlockPlots/HmapHist.jsx'
import PlotHist from '../BlockPlots/PlotHist.jsx'
import RegHist from '../BlockPlots/RegHist.jsx'

import getRandomColor from '../../Functions/getRandomColor.js'
import getFetch from "../../Functions/getFetch.js";

import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

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

function Visual({ urlServer, hmap, setHmap }) {
  let hmapMode = Object.keys(statMxSelectItems).find(el => el == hmap.expression)

  // {x: int, y: int, color: str, spectre: array, type: sign | der, stat: object, name: spectre | other}
  const [signs, setSigns] = useState({
    spectres: [{x: 0, y: 0, color: 'blue', signal: {sign: []}, diff: {sign: []}, name: 'spectre'}],
    type: 'signal',
    active: true,
    startBand: 0,
    endBand: 203
  })

  const { nm } = useLoaderData();

  useEffect(() => {
    if (hmap.expression && !hmapMode) getChannel()
  }, [hmap.expression])

  const getChannel = async () => {
    const { data, ...info} = await getFetch(urlServer, 'bands', {name_hsi: hmap.nameHsi, expr: hmap.expression})
    setHmap({...hmap, channel: data, ...info})
  };
  
  const pressChannel = async e => {
    if (e.type === 'keydown' && e.key === "Enter" || e.type === 'blur') {
      setHmap({...hmap, expression: e.target.value})
    }
  };

  const fetchSpectre = async (x, y) => {
    return await getFetch(urlServer, 'signal', {name_hsi: hmap.nameHsi, x, y})
  }

  const pushSpectre = async e => {
    const {x, y} = e.points[0]
    setSigns({...signs, spectres: [...signs.spectres, {...await fetchSpectre(x, y), x, y, color: getRandomColor(), name: 'spectre'}]})
  }

  const setSmartSpectre = async e => {
    if (e.key == 'Enter') {
      const str = e.target.value.split(' | ')
      const xy_arr = str.filter(item => item)
      console.log(xy_arr)
      if (xy_arr.length === 0) {
        setSigns({...signs, spectres: []})
        return
      }
      const spec_arr = await Promise.all(
        xy_arr.map(async xy_item => {
          const [x, y] = xy_item.split(',').map(el => Number(el))
          const signData = await fetchSpectre(x, y)
          return {...signData, x, y, color: getRandomColor(), name: 'spectre'}
        })
      )
      const res = spec_arr.filter(item => item.spectre)
      if (res.length !== 0) setSigns({...signs, spectres: res})

      console.log(signs)
    }
  }

  const convert2Shapes = (radius=.5) => {
    return signs.spectres.map(spec => ({
      type: 'circle',
      xref: 'x',
      yref: 'y',
      fillcolor: spec.color,
      x0: spec.x-radius,
      y0: spec.y-radius,
      x1: spec.x+radius,
      y1: spec.y+radius,
      line: {
        color: spec.color
      }
    }))
  }

  const getRegression = async (b1=0, b2=0) => {
    // Получить статистику
    const statBand = await getFetch(urlServer, `regression`, {name_hsi: hmap.nameHsi, b1, b2})
    setSigns({...signs, spectres: [{...statBand, x: -1, y: -1, name: 'matrix_correlation', color: getRandomColor()}]})
  };

  const getStatMx = async (name=hmap.expression, startBand=signs.startBand, endBand=signs.endBand) => {
    const mxInfo = await getFetch(urlServer, 'idx_mx', {name_hsi: hmap.nameHsi, name, startBand, endBand})
    console.log(mxInfo)
    setHmap({...hmap, channel: mxInfo[signs.type].idx_mx.data, expression: name, hist: mxInfo[signs.type].idx_mx.hist, bins: mxInfo[signs.type].idx_mx.bins})
    
    setSigns({...signs, startBand, endBand, spectres: [{signal: {sign: mxInfo['signal'].sign}, diff: {sign: mxInfo['diff'].sign}, x: -1, y: -1, name, color: getRandomColor(), ...mxInfo}]})
  }

  return (
    <>
      <div className="panel">
        {hmap.channel && <IconMenu
          buttonList={[
            {name: 'Спектры и каналы / Статистика', icon: <EditIcon />, onClick: e => setSigns({...signs, active: !signs.active})},
            {name: 'Сохранить спектры (пока не работает)', icon: <FileCopyIcon />},
            {name: 'Спектр / Производная', icon: <ArchiveIcon />, onClick: e => setSigns({...signs, type: signs.type === 'signal' ? 'diff' : 'signal'})},
            {name: '-----------------------------------------------', icon: <MoreHorizIcon />}
          ]}
        />}

        {signs.active && <Stack direction="row" spacing={2}>
          <SmartInput pressChannel={pressChannel} story={hmap.index_story}/>
          <SmartInput pressChannel={setSmartSpectre} value={signs.spectres.map(item=>item.name !== 'spectre' ? item.name : `${item.x},${item.y}`).join(' | ')} title='Умный спектр'/>
        </Stack>}

        {!signs.active && <Stack direction="row" spacing={2}>
          <SelectStatic
            menuItems={statMxSelectItems}
            value={hmap.expression}
            handleChange={e => getStatMx(e.target.value)}
            title='Статистика'
          />
          <Track 
            value={[signs.startBand, signs.endBand]} 
            handleChange={async (e, newValue) =>
              {
                await getStatMx(hmap.expression, newValue[0], newValue[1])
              }
            }
            min={0}
            max={203}
            step={1}
            title='Граница каналов'
            marks={[
              {value: 0, label: `${nm[0]}`}, 
              {value: 51, label: `${nm[51]}`}, 
              {value: 102, label: `${nm[102]}`}, 
              {value: 153, label: `${nm[153]}`}, 
              {value: 203, label: `${nm[203]}`}
            ]}
          />
        </Stack>}
      </div>
      <div className="workflow">
        
        <Stack direction={'row'} spacing={5}>
          {hmap.channel && signs.spectres[0].name === "matrix_correlation" &&
            <RegHist 
            plotProps={{
              line_x: signs.spectres[0].line_1, 
              line_y: signs.spectres[0].line_2, 
              point_x: signs.spectres[0].points_1, 
              point_y: signs.spectres[0].points_2,
              line_name: `Линия регрессии = Ax + B`,
              point_name: 'Облако точек',
              xlabel: `Канал ${signs.spectres[0].b1} (${nm[signs.spectres[0].b1]} nm)`,
              ylabel: `Канал ${signs.spectres[0].b2} (${nm[signs.spectres[0].b2]} nm)`, 
              startBand: signs.startBand, 
              endBand: signs.endBand
            }}
            histProps={{
              bins: ['Корреляция', 'Детерминация', 'Эластичность', 'Бета', 'A', 'B'],
              hist: [{data: [signs.spectres[0].correlation, signs.spectres[0].determination, signs.spectres[0].elastic, signs.spectres[0].beta, signs.spectres[0].a, signs.spectres[0].b], color: getRandomColor()}]
            }}
            width={650}
          />}

          {hmap.channel && signs.spectres[0].name !== "matrix_correlation" &&
            <PlotHist 
              plotProps={{data: signs.spectres, height: 500, startBand: signs.startBand, endBand: signs.endBand, type: signs.type}}
              histProps={{
                hist: signs.spectres.map(spectre => ({
                  data: [
                    spectre[signs.type].max, 
                    spectre[signs.type].min, 
                    spectre[signs.type].mean, 
                    spectre[signs.type].std, 
                    spectre[signs.type].scope, 
                    spectre[signs.type].iqr, 
                    spectre[signs.type].q1, 
                    spectre[signs.type].median, 
                    spectre[signs.type].q3
                  ], 
                  color : spectre.color
                })),
                bins: ['Max', 'Min', 'Mean', 'Std', 'Scope', 'IQR', 'Q1', 'Median', 'Q3']
              }}
          />}

          {hmap.channel && <HmapHist 
            histProps={{hist: [{data: hmap.hist, color: getRandomColor()}], bins: hmap.bins, colorHist: 'pink'}}
            hmapProps={{z: hmap.channel, 
              colorHmap: hmap.colormap, flagNull: !hmapMode ? true : false, type: hmap.type, 
              clickFunc: async (e) => {
                const { x, y } = e.points[0];
                if (hmapMode) await getRegression(x, y);
                else await pushSpectre(e) // getSpectre(x, y);
              },
              shapes: convert2Shapes()
            }}
          />}
        </Stack>
      </div>
      
    </>
  );
}

export default Visual;

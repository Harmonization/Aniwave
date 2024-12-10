import { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import * as XLSX from "xlsx";

import HmapHist from '../BlockPlots/HmapHist.jsx'
import PlotHist from '../BlockPlots/PlotHist.jsx'

import { Stack } from "@mui/material";

import SmartInput from "../mui/SmartInput";
import SelectStatic from "../mui/SelectStatic";
import NumberSlider from "../mui/NumberSlider";
import Track from "../mui/Track";
import CheckboxListSecondary from "../mui/CheckboxListSecondary";
import IconMenu from "../mui/IconMenu.jsx";

import getRandomColor from "../../Functions/getRandomColor.js";
import getFetch from "../../Functions/getFetch.js";
import postFetch from "../../Functions/postFetch.js";

import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const smoothMethods = {
  golay: "Фильтр Савицкого - Голея",
  nadarai: "Формула Надарая - Ватсона",
};

function BigCubes({ urlServer, hmap, setHmap }) {
  const { nm, settings } = useLoaderData();

  const [sign, setSign] = useState({
    spectres: [],
    filter: settings.filter,
    h: settings.h,
    type: 'signal',
    active: true
  });

  const [roi, setRoi] = useState(
    settings.rois_story.map((roi_str) => ({
      roi_str,
      active: false,
      color: getRandomColor(),
    }))
  );

  useEffect(() => {
    if (hmap.nameHsi) getChannel();
  }, [hmap.nameHsi, hmap.expression]);

  useEffect(() => {
    reloadSpectres();
  }, [sign.filter, sign.h]);

  const getChannel = async () => {
    const { data, max, min, ...info} = await getFetch(urlServer, 'bands', {name_hsi: hmap.nameHsi, expr: hmap.expression})
    setHmap({
      ...hmap,
      channel: data,
      min_lim: Math.floor(min * 100) / 100,
      max_lim: Math.ceil(max * 100) / 100,
      ...info
    });
  };

  const pressChannel = async (e) => {
    if ((e.type === "keydown" && e.key === "Enter") || e.type === "blur") {
      setHmap({ ...hmap, expression: e.target.value });
    }
  };

  const reloadSpectres = async () => {
    const new_spectres = await Promise.all(
      sign.spectres.map(async (spec) => ({
        ...spec,
        ...await fetchSpectre(spec.x, spec.y),
      }))
    );
    setSign({ ...sign, spectres: new_spectres });
  };

  const setSmartSpectre = async (e) => {
    if (e.key == "Enter") {
      const str = e.target.value.split(" | ");
      const xy_arr = str.filter((item) => item);
      console.log(xy_arr);
      if (xy_arr.length === 0) {
        setSign({ ...sign, spectres: [] });
        return;
      }
      const spec_arr = await Promise.all(
        xy_arr.map(async (xy_item) => {
          const [x, y] = xy_item.split(",").map((el) => Number(el));
          const signData = await fetchSpectre(x, y);
          return {...signData, x, y, color: getRandomColor() };
        })
      );
      const res = spec_arr.filter((item) => item.spectre);
      if (res.length !== 0) setSign({ ...sign, spectres: res });
    }
  };

  const fetchSpectre = async (x, y) => {
    return await getFetch(urlServer, 'signal', {name_hsi: hmap.nameHsi, x, y, method: sign.filter, h: sign.h})
  };

  const pushSpectre = async (e) => {
    const { x, y } = e.points[0];
    const signData = await fetchSpectre(x, y);
    setSign({...sign, spectres: [...sign.spectres, { ...signData, x, y, color: getRandomColor() }] });
  };

  const str2Numbers = (name) => {
    const [x0, x1, y0, y1] = name
      .split(",")
      .map((num_str) => Number(num_str.split("=")[1]));
    return [x0, x1, y0, y1];
  };

  const convert2Shapes = () => {
    const filter_settings = roi.filter((el) => el.active);
    const rectangles = filter_settings.map((el) => {
      const [x0, x1, y0, y1] = str2Numbers(el.roi_str);
      return {
        type: "rect", x0, y0, x1, y1,
        line: {
          color: el.color,
        },
      };
    });
    return [
      ...rectangles,
      ...sign.spectres.map((spec) => ({
        type: "circle",
        xref: "x",
        yref: "y",
        fillcolor: spec.color,
        x0: spec.x - 3,
        y0: spec.y - 3,
        x1: spec.x + 3,
        y1: spec.y + 3,
        line: {
          color: spec.color,
        },
      })),
    ];
  };

  const thresholding = (arr) => {
    // Маскирование двумерного массива
    return arr.map((row) =>
      row.map((item) => (hmap.min_thr <= item && item <= hmap.max_thr) || item == 0 ? item : null));
  };

  const upload = async (filename) => {
    postFetch(urlServer, 'upload', {
      method: sign.filter,
      h: sign.h,
      expr: hmap.expression,
      t1: hmap.min_thr,
      t2: hmap.max_thr,
      rois: roi
        .filter((el) => el.active)
        .map((el) => str2Numbers(el.roi_str)), // Двумерный массив
      filename,
    })
  };

  const saveSpectre2Xlsx = () => {
    let start = nm.map((val, indx) => ({ band: indx, nm: val }));
    sign.spectres.forEach((spec) => {
      start = start.map((item, indx) => ({
        ...item,
        [`${spec.x},${spec.y}`]: spec.spectre[indx],
      }));
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(start);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
    XLSX.writeFile(wb, "Спектры.xlsx");
  };

  const saveSettings = async () => {
    postFetch(urlServer, 'settings/save', {
      channel: hmap.expression,
      index_story: hmap.index_story,
      rois_story: roi.map((el) => el.roi_str), // Двумерный массив
      colormap: hmap.colormap,
      filter: sign.filter,
      h: sign.h,
      t1: hmap.min_thr,
      t2: hmap.max_thr,
    })
  };

  return (
    <>
      {hmap.channel && <IconMenu
        buttonList={[
          {name: 'Спектры / Маска и ROI', icon: <EditIcon />, onClick: e => setSign({...sign, active: !sign.active})},
          {name: 'Сохранить спектры', icon: <FileCopyIcon />, onClick: saveSpectre2Xlsx},
          {name: 'Спектр / Производная', icon: <ArchiveIcon />, onClick: e => setSign({...sign, type: sign.type === 'signal' ? 'diff' : 'signal'})},
          {name: 'Сохранить настройки', icon: <MoreHorizIcon />, onClick: saveSettings}
        ]}
      />}

      {hmap.channel && (
        <div className="workflow">
          {sign.active && <Stack direction={"row"} spacing={5}>
            <SelectStatic
              menuItems={smoothMethods}
              value={sign.filter}
              handleChange={(e) => setSign({ ...sign, filter: e.target.value })}
              title="Сглаживание"
              nullElem={true}
            />
            <NumberSlider
              min={3}
              changeFunc={(e) => setSign({ ...sign, h: e.target.value })}
              value={sign.h}
            />
            <SmartInput
              pressChannel={setSmartSpectre}
              value={sign.spectres
                  .map((item) => `${item.x},${item.y}`)
                  .join(" | ")}
              title="Умный спектр"
            />
          </Stack>}

          <div className="plots">
            <Stack direction={"row"} spacing={5}>
              
              {sign.active && <PlotHist 
                plotProps={{data: sign.spectres, height: 500, type: sign.type}}
                histProps={{
                  hist: sign.spectres.map(spectre => ({
                    data: [
                      spectre[sign.type].max, 
                      spectre[sign.type].min, 
                      spectre[sign.type].mean, 
                      spectre[sign.type].std, 
                      spectre[sign.type].scope, 
                      spectre[sign.type].iqr, 
                      spectre[sign.type].q1, 
                      spectre[sign.type].median, 
                      spectre[sign.type].q3
                    ], 
                    color : spectre.color
                  })),
                  bins: ['Max', 'Min', 'Mean', 'Std', 'Scope', 'IQR', 'Q1', 'Median', 'Q3']
                }}
              />}

              {!sign.active && <Stack spacing={5}>
                <SmartInput
                  pressChannel={pressChannel}
                  story={hmap.index_story}
                  defaultValue={hmap.expression}
                  title="Умный индекс"
                />
                <Track
                  value={[hmap.min_thr, hmap.max_thr]}
                  handleChange={(e, newValue) =>
                    setHmap({ ...hmap, min_thr: newValue[0], max_thr: newValue[1] })
                  }
                  min={hmap.min_lim}
                  max={hmap.max_lim}
                />
                <CheckboxListSecondary
                  itemStory={roi}
                  setItem={setRoi}
                  submitFunc={upload}
                />
              </Stack>}

              <HmapHist
                histProps={{hist: [{data: hmap.hist, color: getRandomColor()}], bins: hmap.bins}}
                hmapProps={{z: thresholding(hmap.channel), colorHmap: hmap.colormap, type: hmap.type, 
                  clickFunc: pushSpectre,
                shapes: convert2Shapes()
                }}
              />
            </Stack>
          </div>
        </div>
      )}
    </>
  );
}

export default BigCubes;

import { useState, useEffect } from 'react'
import { useLoaderData } from 'react-router-dom'

import Rgb from './plots/Rgb.jsx'

import Stack from "@mui/material/Stack";

import SmartInput from "./mui/SmartInput";
import SelectStatic from './mui/SelectStatic.jsx'
import HiddenImage from './mui/HiddenImage.jsx'
import SelectAllTransferList from './mui/SelectAllTransferList.jsx'
import Track from "./mui/Track";
import CustomizedDividers from './mui/CustomizedDividers.jsx';
import LeftMenu from './mui/LeftMenu.jsx'
import HintsStepper from './mui/HintsStepper.jsx';
import ContentTabs from './mui/ContentTabs.jsx';
import CheckboxDown from './mui/CheckboxDown.jsx';
import OpenDialog from './mui/OpenDialog.jsx';
import CheckboxListSecondary from './mui/CheckboxListSecondary.jsx'

import HistPlot from './plots/HistPlot.jsx';
import Heatmap from "./plots/Heatmap";
import LinePlot from './plots/LinePlot'

import getFetch from '../Functions/getFetch.js'
import getRandomColor from '../Functions/getRandomColor.js'

import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { Button } from '@mui/material';
import ButtonGroup from '@mui/material/ButtonGroup';
import Slider3 from './mui/Slider3.jsx';

const stepperContent = {
  tir: ['Откройте TIR.', 
    'Выберите область интереса (ROI).', 
    'Отметьте точку на HSI, и соответствующую ей точку на термальном снимке. Отметьте не менее 4 пар точек.', 
    'Проведите совмещение с помощью преобразования гомографии.', 
    'Сохраните результат совмещения.'
  ],
  preprocessing: [
    'Введите математическое выражение для спектрального индекса в текстовое поле и нажмите Enter. Можно оперировать как номерами каналов, так и нанометрами.', 
    'Отделите фон от исследуемого объекта на изображении с помощью двойного слайдера по нижней и верхней границе.', 
    'Проведите сглаживание / фильтрацию сигнатур HS данных с помощью одного из предложенных методов и выберите длину окна сглаживания.', 
    'Отметьте одну или несколько областей интереса (ROI) которые необходимо сохранить для дальнейшей работы.', 
    'Сохраните результат в виде набора предобработанных ROI.'
  ],
  cluster: [
    'Выберите метод неконтроллируемой классификации для текущих HS данных. Количество полос рядом с название метода отвечает за продолжительность вычислений.',
    'Введите количество классов которое необходимо найти и нажмите Enter.'
  ],
  spectral: [
    'Выберите метод классификации HS изображения относительно выбранной спектральной сигнатуры.',
    'Щелкните на изображении для выбора пикселя, соответствующего интересующему материалу. Произойдет рассчет расстояния других сигнатур изображения относительно выбранной.'
  ],
  etalon: [
    'Выберите метод автоматического поиска спектральных сигнатур на HS изображении, которые соответствуют различным классам.',
    'Выберите метод построения особого вида изображений, каждое из которых определяет долю содержания соответствующего класса в каждом пикселе.',
    'Введите количество классов которое необходимо найти и нажмите Enter.'
  ],
  cluster_2: [
    'Выберите алгоритм кластеризации в выпадающем списке.',
    'Выберите метрику которую использует алгоритм.',
    'Выберите каналы участвующие в кластеризации в текстовом поле.',
    'Введите порог (или кол-во кластеров) и нажмите клавишу Enter.'
  ],
  emd: [
    'Введите количество мод.',
    'Введите размер окна как целое число и нажмите клавишу Enter.',
    'Введите номер отображаемого канала или моды в соответствующем текстовом поле и нажмите клавишу Enter для визуализации.'
  ],
  rgb: [
    'Тройной трекер отвечает за каналы, участвующие в синтезе RGB. Измените значения трекера чтобы получить синтез из данных каналов.',
    'RGB изображение также может быть построено с помощью мод, участвующих в EMD разложении на соответствующей вкладке. Выберите номер моды для одного из каналов, выбранного на трекере, в выпадающем списке, чтобы изменить результат синтеза.',
  ],
  cluster_corr: [
    'Для построения графиков центроидов или медоидов, полученных в результате кластеризации, а также отображения соответствующей им матрицы корреляции, нажмите соответствующую кнопку.',
  ],
  reley: [
    'Для расчета релеевского рассеяния и отображения графика по данной ГСИ нажмите на соответствующую кнопку.',
    'Применить изменения для текущего ГСИ можно нажатием на кнопку "Вычесть релеевское рассеяние".',
    'Для расчета графика отклонения введите значение параметра сигма и нажмите Enter.',
    'Сигма-отклонение можно применить нажатием кнопки "Отфильтровать".'
  ]
}

const clusterContent_2 = {
  cosine: 'Косинусная',
  hdbscan: 'HDBSAN',
  sch: 'Иерархическая'
}

const clusterMetrics = {
  cosine: 'cosine',
  euclidean: 'euclidean',
  cityblock: 'cityblock',
  hamming: 'hamming'
}

const smoothMethods = {
  golay: "Фильтр Савицкого - Голея",
  nadarai: "Формула Надарая - Ватсона",
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

  const classificationSelectItems = {
    sam: "SAM",
    sid: "SID",
    sca: "SCA",
  };

  const clusterContent = {
    kmeans: "KMeans",
    mini_batch_kmeans: "MiniBatchKMeans",
    birch: "Birch",
    spectral_clustering: "SpectralClustering |",
    agglomerative_clustering: "AgglomerativeClustering |",
    gaussian_mixture: "GaussianMixture |",
    affinity_propagation: "AffinityPropagation ||",
    optics: "OPTICS ||"
  }

  const etalonContent = {
    ppi: 'PPI',
    nfindr: 'NFINDR',
  }
  
  const mapsMethods = {
    fcls: 'FCLS',
    ucls: 'UCLS',
    nnls: 'NNLS'
  }

function Menu() {
  const { settings, colorsDict, serverUrl, downloadedFiles, diskFiles, nm } = useLoaderData()
  const urlServer = serverUrl
  const [tab, setTab] = useState(0) // Какая вкладка открыта

  const [roi, setRoi] = useState(settings.rois_story.map(roi_str => ({roi_str, active: false, color: getRandomColor()})))

  const [etalon_map, setMap] = useState(Object.keys(mapsMethods)[0])

  const [images, setImages] = useState({diskFiles, downloadedFiles})

  const [hmap, setHmap] = useState({
    nameHsi: '',
    count_bands: 204,
    rgb: null,
    expression: settings.channel,
    index_story: settings.index_story,
    channel: null, 
    hist: null,
    bins: null,
    colormap: settings.colormap,
    type: 'heatmap',
    min_thr: settings.t1,
    max_thr: settings.t2,
    min_lim: -1,
    max_lim: 1,
    tir: null,
    mx: null,
    relativeIndx: {channel: null},
    fastClusterIndx: {channel: null},
    clusterIndx: {channel: null, thr: .99, method: 'cosine', metrics: 'cosine', centroids: [], medoids: [], mx_corr: {channel: null, mode: 'centroids'}},
    emd: {channel: null, number_of_modes: 8, windows_size: 3, n_band: 0, n_mode: 0},
    reley: {spectres: []},
    sigma: {spectres: [], value: 2},
    hiddenMask: true,
    leftClick: 'push'
  })
  
  const [sign, setSign] = useState({
    spectres: [],
    filter: settings.filter,
    h: settings.h,
    type: 'signal',
    active: true,
    startBand: 0,
    endBand: hmap.count_bands-1
  });
  const [extract, setExtract] = useState([])
  const [method, setMethod] = useState('sam')
  
  const [rgbTrack, setRgbTrack] = useState({
    red: 70,
    green: 51,
    blue: 19,
    min_lim: 0,
    max_lim: hmap.count_bands-1,
    red_mode: undefined,
    green_mode: undefined,
    blue_mode: undefined,
    sliderCommit: false // Для применения изменений слайдера
  })

  const [tracker, setTrack] = useState({
    mode: 'thr',
    thr: {
      min_lim: -1,
      max_lim: 1,
      min_val: -1,
      max_val: 1,
      title: 'Отделение от фона',
      step: undefined,
      marks: undefined
    },
    filter: {
      min_lim: 3,
      max_lim: 25,
      min_val: 5,
      max_val: 5,
      title: 'Длина окна фильтрации',
      handleChange: (e) => setTrack({ ...tracker, filter: {...tracker.filter, max_val: e.target.value}}), //(e) => setSign({ ...sign, h: e.target.value }),

      step: 1
    },
    boundary: {
      min_lim: 0,
      max_lim: hmap.count_bands-1,
      min_val: 0,
      max_val: hmap.count_bands-1,
      title: 'Граница каналов',
      step: 1,
      marks: [
        {value: 0, label: `${nm[0]}`}, 
        {value: 51, label: `${nm[51]}`}, 
        {value: 102, label: `${nm[102]}`}, 
        {value: 153, label: `${nm[153]}`}, 
        {value: hmap.count_bands-1, label: `${nm[hmap.count_bands-1]}`}
      ]
    }
  })

  const upload = async filename => {
    const request = `http://localhost:8000/upload?`
    const response = await fetch(request, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        method: sign.filter,
        h: sign.h,
        expr: hmap.expression,
        t1: hmap.min_thr,
        t2: hmap.max_thr,
        rois: roi.filter(el => el.active).map(el => str2Numbers(el.roi_str)), // Двумерный массив
        filename
      })
    })
    
    const result = await response.json()
    console.log(result)
  }

  const pressChannel = async (e) => {
    if ((e.type === "keydown" && e.key === "Enter") || e.type === "blur") {
      // setHmap({ ...hmap, expression: e.target.value });
      setSmart({...smart, indx: {...smart.indx, defaultValue: e.target.value}})
    }
  };

  const getEMD = async (e) => {
    if (e.key == "Enter") {
      const {emd} = await getFetch(urlServer, 'emd', {name_hsi: hmap.nameHsi})
      setHmap({...hmap, emd})
    }
  }

  useEffect(() => {
    getEMDChannel();
  }, [hmap.emd.n_mode, hmap.emd.n_band]);

  const getEMDChannel = async () => {
    const {emd} = await getFetch(urlServer, 'emd_channel', {name_hsi: hmap.nameHsi, n_mode: hmap.emd.n_mode, n_band: hmap.emd.n_band})
    console.log(emd)
    setHmap({...hmap, emd: {...hmap.emd, channel: emd.channel}})
    setHist({...hist, indx: {hist: emd.hist, bins: emd.bins}})
  }

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
      const res = spec_arr.filter((item) => item.signal);
      if (res.length !== 0) setSign({ ...sign, spectres: res });
    }
  };

  const [smart, setSmart] = useState({
    mode: 'indx',
    indx: {
      defaultValue: settings.channel,
      preccFunction: pressChannel,
      title: 'Умный индекс',
      story: settings.index_story,
      value: undefined
    },
    sign: {
      defaultValue: undefined,
      pressFunction: setSmartSpectre,
      title: 'Умный спектр',
      story: undefined,
      value: sign.spectres.map((item) => `${item.x},${item.y}`).join(" | ")
    }
  })

  const [hist, setHist] = useState({
    mode: 'indx',
    indx: {
      bins: null,
      hist: null
    },
    sign: {
      bins: ['Max', 'Min', 'Mean', 'Std', 'Scope', 'IQR', 'Q1', 'Median', 'Q3'],
      hist: null
    },
    indx_info: {
      bins: ['Max', 'Min', 'Mean', 'Std', 'Scope', 'IQR', 'Q1', 'Median', 'Q3', 'Entropy'],
      hist: null
    },
    width: 500,
    height: 200,
    color: getRandomColor()
  })

  useEffect(() => {
    getStatMx(hmap.expression, tracker.boundary.min_val, tracker.boundary.max_val)
  }, [tracker.boundary.min_val, tracker.boundary.max_val])

  useEffect(() => {
    reloadSpectres();
  }, [sign.filter, tracker.filter.max_val]);

  useEffect(() => {
    if (hmap.nameHsi) getChannel();
  }, [hmap.nameHsi, smart.indx.defaultValue]);

  useEffect(() => {
    getRgbSyn();
  }, [rgbTrack.sliderCommit, rgbTrack.blue_mode, rgbTrack.green_mode, rgbTrack.red_mode]);

  const getRgbSyn = async () => {
    const fetch_arg = {name_hsi: hmap.nameHsi, red: rgbTrack.red, green: rgbTrack.green, blue: rgbTrack.blue}
    if (rgbTrack.blue_mode) fetch_arg.blue_mode = rgbTrack.blue_mode
    if (rgbTrack.green_mode) fetch_arg.green_mode = rgbTrack.green_mode
    if (rgbTrack.red_mode) fetch_arg.red_mode = rgbTrack.red_mode
    const result = await getFetch(urlServer, 'rgb_synthesize', fetch_arg)
    // setHmap({...hmap, clusterIndx: {...hmap.clusterIndx, channel: segmentation, hist, bins, centroids, medoids}})
    setRgbTrack({...rgbTrack, rgb: result.rgb, sliderCommit: false})
  }

  const openTir = async name => {
    const result = await getFetch(serverUrl, 'tir', {name})
    setHmap({...hmap, tir: {points: []}, ...result})
  }
  
  const openImg = async name => {
    // Открытие файла по имени
    const fileinfo = await getFetch(serverUrl, 'open', {name})
    setHmap({...hmap, nameHsi: fileinfo.name, rgb: fileinfo.rgb, count_bands: fileinfo.count_bands})
    setSign({ ...sign, endBand: fileinfo.count_bands-1});
    setTrack({ ...tracker, boundary: {...tracker.boundary, max_lim: fileinfo.count_bands-1, max_val: fileinfo.count_bands-1}})
  }
console.log(hmap)
console.log(sign)
  const fetchSpectre = async (x, y) => {
    return await getFetch(urlServer, 'signal', {name_hsi: hmap.nameHsi, x, y, method: sign.filter, h: tracker.filter.max_val})
  };

  const pushSpectre = async (e) => {
    const { x, y } = e.points[0];
    const signData = await fetchSpectre(x, y);
    setSign({...sign, spectres: [...sign.spectres, { ...signData, x, y, color: getRandomColor() }] });
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
console.log(hmap)
  const getChannel = async () => {
    const { data, max, min, ...info} = await getFetch(urlServer, 'bands', {name_hsi: hmap.nameHsi, expr: smart.indx.defaultValue})
    setHmap({
      ...hmap,
      channel: data,
      relativeIndx: {channel: hmap.relativeIndx.channel ? hmap.relativeIndx.channel : data},
      fastClusterIndx: {channel: hmap.fastClusterIndx.channel ? hmap.fastClusterIndx.channel : data},
      min_lim: Math.floor(min * 100) / 100,
      max_lim: Math.ceil(max * 100) / 100,
      ...info
    });

    setTrack({
      ...tracker, 
      thr: {
        ...tracker.thr,
        min_lim: Math.floor(min * 100) / 100, 
        max_lim: Math.ceil(max * 100) / 100,
        min_val: Math.floor(min * 100) / 100,
        max_val: Math.ceil(max * 100) / 100
      }
    })
    
    setHist({...hist, indx: {...hist.indx, ...info}})
  };

  const thresholding = (arr) => {
    // Маскирование двумерного массива
    if (!hmap.hiddenMask) return arr
    return arr.map((row) =>
      row.map((item) => (tracker.thr.min_val <= item && item <= tracker.thr.max_val) || item == 0 ? item : null));
  };

  

  const getStatMx = async (name=hmap.expression, startBand=sign.startBand, endBand=sign.endBand) => {
    const mxInfo = await getFetch(urlServer, 'idx_mx', {name_hsi: hmap.nameHsi, name, startBand, endBand})
    console.log(mxInfo)
    setHmap({...hmap, hiddenMask: false, mx: {channel: mxInfo[sign.type].idx_mx.data, expression: name, hist: mxInfo[sign.type].idx_mx.hist, bins: mxInfo[sign.type].idx_mx.bins}})
    
    setSign({...sign, startBand, endBand, spectres: [{signal: {sign: mxInfo['signal'].sign}, diff: {sign: mxInfo['diff'].sign}, x: -1, y: -1, name, color: getRandomColor(), ...mxInfo}]})
    
    setTrack({
      ...tracker, 
      thr: {
        ...tracker.thr,
        min_lim: Math.floor(mxInfo[sign.type].min * 100) / 100, 
        max_lim: Math.ceil(mxInfo[sign.type].max * 100) / 100,
        min_val: Math.floor(mxInfo[sign.type].min * 100) / 100,
        max_val: Math.ceil(mxInfo[sign.type].max * 100) / 100
      }
    })

    setHist({...hist, indx: {
      ...hist.indx, 
      hist: mxInfo[sign.type].idx_mx.hist, 
      bins: mxInfo[sign.type].idx_mx.bins,
    },
  })
  }

  const getSpectreClass = async e => {
    const { x, y } = e.points[0]
    const {data, ...info} = await getFetch(urlServer, 'classes', {name_hsi: hmap.nameHsi, method, x, y})
    
    // setHmap({...hmap, channel: data, expression: method, ...info})
    setHmap({...hmap, relativeIndx: {channel: data, expression: method, ...info}})
    setHist({...hist, indx: {...hist.indx, ...info}})
    console.log(info)
    setTrack({
      ...tracker, 
      thr: {
        ...tracker.thr,
        min_lim: Math.floor(info.min * 100) / 100, 
        max_lim: Math.ceil(info.max * 100) / 100,
        min_val: Math.floor(info.min * 100) / 100,
        max_val: Math.ceil(info.max * 100) / 100
      }
    })

    await pushSpectre(e)
  }

  const startReley = async (e) => {
    const {reley} = await getFetch(urlServer, 'reley', {name_hsi: hmap.nameHsi})
    setHmap({...hmap, reley: {...hmap.reley, spectres: reley.map(el => ({...el, x: -1, y: -1, color: getRandomColor()}))}})
    // setHist({...hist, indx: {...hist.indx, hist: result.hist, bins: result.bins}})
  }

  const startSigma = async (e) => {
    if (e.key === 'Enter') {
      const {sigma} = await getFetch(urlServer, 'sigma', {name_hsi: hmap.nameHsi, sigma: e.target.value})
      setHmap({...hmap, sigma: {...hmap.sigma, spectres: sigma.map(el => ({...el, x: -1, y: -1, color: getRandomColor()}))}})
      // setHist({...hist, indx: {...hist.indx, hist: result.hist, bins: result.bins}})
    }
  }

  const startClusterCorr = async (mode='centroids') => {
    const result = await getFetch(urlServer, 'clusters_corr', {name_hsi: hmap.nameHsi, mode})
    setHmap({...hmap, clusterIndx: {...hmap.clusterIndx, mx_corr: {...hmap.clusterIndx.mx_corr, channel: result.segmentation, mode: result.mode, hist: result.hist, bins: result.bins}}})
    setHist({...hist, indx: {...hist.indx, hist: result.hist, bins: result.bins}})
  }

  const startCluster2 = async e => {
    if (e.key === 'Enter') {
      const result = await getFetch(urlServer, 'clusters_2', {name_hsi: hmap.nameHsi, thr: e.target.value, method: hmap.clusterIndx.method, metrics: hmap.clusterIndx.metrics})
      // setHmap({...hmap, channel: segmentation, hist, bins})
      console.log(result)
      setHmap({...hmap, clusterIndx: {...hmap.clusterIndx, channel: result.segmentation, hist: result.hist, bins: result.bins, centroids: result.centroids.map(el => ({...el, x: -1, y: -1, color: getRandomColor()})), medoids: result.medoids.map(el => ({...el, x: -1, y: -1, color: getRandomColor()}))}})
      // setExtract([...extract, {data: segmentation, hist, bins}])
      setHist({...hist, indx: {...hist.indx, hist: result.hist, bins: result.bins}})

      // setSign({...sign, startBand, endBand, spectres: [{signal: {sign: mxInfo['signal'].sign}, diff: {sign: mxInfo['diff'].sign}, x: -1, y: -1, name, color: getRandomColor(), ...mxInfo}]})
    }
  }

  const startClasterization = async e => {
    if (e.key === 'Enter') {
      if (hmap.expression === 'ppi' || hmap.expression === 'nfindr') {
        const {endmembers} = await getFetch(urlServer, 'endmembers', {name_hsi: hmap.nameHsi, k: e.target.value, method: hmap.expression})

        // Заполнение спектров чтобы отразить точки на карте
        const spectres = []
        for (let i = 0; i < endmembers.length; i++) {
          if (i % 2 === 0) {
            spectres.push({x: endmembers[i], y: null, color: getRandomColor()})
          }
          else {
            spectres[spectres.length - 1]['y'] = endmembers[i]
          }
        }

        // Запрос нужных спектров по известным координатам  (скопировано из функции reload_spectres)
        const new_spectres = await Promise.all(
          spectres.map(async (spec) => ({
            ...spec,
            ...await fetchSpectre(spec.x, spec.y),
          }))
        );
        setSign({ ...sign, spectres: new_spectres });


        const {amaps} = await getFetch(urlServer, 'amaps', {name_hsi: hmap.nameHsi, method: etalon_map, endmembers})
        console.log(amaps)
        
        // setExtract(amaps)
        // setExtract([...extract, ...amaps])
        setHmap({...hmap, channel: amaps[0].data, hist: amaps[0].hist, bins: amaps[0].bins})
      }
      else {
        const result = await getFetch(urlServer, 'clusters', {name_hsi: hmap.nameHsi, k: e.target.value, method: hmap.expression})
        setHmap({...hmap, channel: result.segmentation, hist: result.hist, bins: result.bins})
        setHmap({...hmap, fastClusterIndx: {channel: result.segmentation, hist: result.hist, bins: result.bins}})
        setExtract([...extract, {data: result.segmentation, hist: result.hist, bins: result.bins}])
        setHist({...hist, indx: {...hist.indx, hist: result.hist, bins: result.bins}})
      }
    }
  }
console.log(hist)
  const navigation = [
    {
        title: 'Открыть HSI',
        type: 'button',
        icon: <DashboardIcon />,
        click: e => console.log('1')
    },
    
    {
      title: 'Скачать HSI с диска',
      type: 'list',
      content: <OpenDialog component1={<SelectAllTransferList url={serverUrl} diskFiles={images.diskFiles} downloadedFiles={images.downloadedFiles} openImg={openImg}/>}/>
    },
    {
        title: 'Сохранить',
        type: 'button',
        icon: <BarChartIcon />,
        click: console.log('Сохранить')
    },
    {
        title: 'coloring',
        type: 'list',
        content: <SelectStatic 
                    menuItems={colorsDict} 
                    value={hmap.colormap} 
                    handleChange={e => setHmap({...hmap, colormap: e.target.value})} 
                    title='Цветовая палитра'
                  />
    },
  ];

  const str2Numbers = name => {
    const [x0, x1, y0, y1] = name.split(',').map(num_str => Number(num_str.split('=')[1]))
    return [x0, x1, y0, y1]
  }

  const convert2Shapes = (tirPoint=false) => {
    // Если tir
    if (tirPoint) {
      return tir.points.map(spec => ({
        type: 'circle',
        xref: 'x',
        yref: 'y',
        fillcolor: spec.color,
        x0: spec.x-3,
        y0: spec.y-3,
        x1: spec.x+3,
        y1: spec.y+3,
        line: {
          color: spec.color
        }
      }))
    }

    const filter_settings = roi.filter(el => el.active)
    const rectangles = filter_settings.map(el => {
      const [x0, x1, y0, y1] = str2Numbers(el.roi_str)
      return {
        type: 'rect',
        x0: x0,
        y0: y0,
        x1: x1,
        y1: y1,
        line: {
          color: el.color
        }
      }
    })
    const points = sign.spectres.map(spec => ({
      type: 'circle',
      xref: 'x',
      yref: 'y',
      fillcolor: spec.color,
      x0: spec.x-3,
      y0: spec.y-3,
      x1: spec.x+3,
      y1: spec.y+3,
      line: {
        color: spec.color
      }
    }))
    
    return tab === 3 || tab === 6 ? points : (tab === 2 ? rectangles : [])
  }

  const hmapComponent = (parameters={}) => {
    const {w=580, h=400, thr=true, z_data=hmap.channel, func=pushSpectre, correlation=false, x_title=''} = parameters
    return <Heatmap 
      z={thr ? thresholding(z_data) : z_data} 
      clickFunc={func}
      color={hmap.colormap} 
      flagNull={hmap.hiddenMask} 
      type={hmap.type} 
      width={w}
      height={h} 
      shapes={convert2Shapes()}
      correlation={correlation}
      x_title={x_title}
    />
  }

  const histogramComponent = (w=hist.width, h=hist.height, hist_band=hist[hist.mode].hist, bins_band=hist[hist.mode].bins) => <HistPlot 
    hist={hist.mode !== 'sign' ? [{data: hist.mode === 'indx' ? hist_band : [tracker.thr.max_val, tracker.thr.min_val, hmap.mean, hmap.std, hmap.scope, hmap.iqr, hmap.q1, hmap.median, hmap.q3, hmap.entropy], color: hist.color}] : 
    sign.spectres.map(spectre => ({
      data: [
        spectre[sign.type].max, 
        spectre[sign.type].min, 
        spectre[sign.type].mean, 
        spectre[sign.type].std, 
        spectre[sign.type].scope, 
        spectre[sign.type].iqr, 
        spectre[sign.type].q1, 
        spectre[sign.type].median, 
        spectre[sign.type].q3,
        // spectre[sign.type].entropy
      ], 
      color : spectre.color
    }))} 
    bins={bins_band} 
    width={w} 
    height={h}
  />
console.log(rgbTrack)

  const rgbTrackComponent = <Slider3
    value={[rgbTrack.blue, rgbTrack.green, rgbTrack.red]}
    handleChange={(e, newValue) => setRgbTrack({...rgbTrack, red: newValue[2], green: newValue[1], blue: newValue[0]})}
    handleCommit={(e, newValue) => setRgbTrack({...rgbTrack, sliderCommit: true})}
    min={rgbTrack.min_lim}
    max={rgbTrack.max_lim}
    step={1}
    title={'Номер канала'}
  />

  const trackComponent = (mode='filter', title) => <Track
    value={mode === 'filter' ? tracker[mode].max_val : [tracker[mode].min_val, tracker[mode].max_val]}
    handleChange={
      mode === 'filter' ?
      (e) => setTrack({ ...tracker, filter: {...tracker.filter, max_val: e.target.value}}) :
      (e, newValue) =>
        setTrack({ ...tracker, [mode]: {...tracker[mode], min_val: newValue[0], max_val: newValue[1] }})}
    min={tracker[mode].min_lim}
    max={tracker[mode].max_lim}
    step={tracker[mode].step}
    title={title ? title : tracker[mode].title}
    marks={tracker[mode].marks}
  /> 

  return (
    <div className="page">

      <LeftMenu navigation={navigation}/>

      <Stack direction="row" spacing={2}>

        <Stack spacing={2}>

          <SmartInput
            pressChannel={pressChannel}
            story={smart[smart.mode].story}
            defaultValue={smart[smart.mode].defaultValue}
            title={'HSI индекс'}
            // value={smart.mode === 'sign' && sign.spectres.map((item) => `${item.x},${item.y}`).join(" | ")}
          />

          {hmap.channel && hmapComponent({w: 600, h: 500})}

          <Stack direction="row" spacing={2}>
            <SelectStatic 
              menuItems={{indx: 'HSI индекс', sign: 'Статистика спектров', indx_info: 'Статистика HSI индекса'}} 
              value={hist.mode} 
              handleChange={e => setHist({...hist, mode: e.target.value})} 
              title='Гистограмма'
            />
            <CheckboxDown title={'Производная'} checkFunc={e => setSign({...sign, type: sign.type === 'signal' ? 'diff' : 'signal'})}/>
            <CheckboxDown title={'3D'} checkFunc={e => setHmap({...hmap, type: hmap.type === 'heatmap' ? 'surface' : 'heatmap'})}/>
            <CheckboxDown title={'Показать фон'} checkFunc={e => setHmap({...hmap, hiddenMask: !hmap.hiddenMask})}/>
          </Stack>
          <SmartInput
            // width={400}
            pressChannel={setSmartSpectre}
            title={'Область интереса'}
            value={roi[0].roi_str}
          />
        </Stack>
        
        
        <ContentTabs value={tab} setValue={setTab} buttonsFunc={[undefined, undefined, undefined, e => openTir('3.xlsx')]} content_obj={{
          ['Визуализация']: <>
              <Stack direction="row" spacing={2}>
                {sign.active && <LinePlot data={sign.spectres} height={500} width={500} startBand={sign.startBand} endBand={sign.endBand} type={sign.type}/>}
                
                {hist[hist.mode].bins && histogramComponent()}
              </Stack>

              <SmartInput
                pressChannel={setSmartSpectre}
                title={'Cпектральная сигнатура'}
                value={sign.spectres.map((item) => `${item.x},${item.y}`).join(" | ")}
              />
            </>,
          ['Статистика']: <>
            <Stack spacing={2}>

            <Stack direction="row" spacing={2}>
              <Stack spacing={2}>
                <SelectStatic
                  menuItems={statMxSelectItems}
                  value={hmap.expression}
                  handleChange={e => getStatMx(e.target.value)}
                  title='Статистика'
                />
                {trackComponent('boundary')}
              </Stack>

              {hist[hist.mode].bins && histogramComponent()}
            </Stack>
            
              <Stack direction="row" spacing={2}>
                {hmap.mx && hmapComponent({w: 480, h: 400, thr: false, z_data: hmap.mx.channel})}

                {sign.active && <LinePlot data={sign.spectres} height={450} width={500} startBand={sign.startBand} endBand={sign.endBand} type={sign.type}/>}
              </Stack>

            </Stack>
            </>,
          ['Предобработка']: <>
            <HintsStepper steps={stepperContent.preprocessing}/>
            <Stack direction="row" spacing={2}>
              {trackComponent('filter')}
              {trackComponent('thr')}
            </Stack>

            <Stack direction="row" spacing={2}>
              {sign.active && <LinePlot data={sign.spectres} height={400} width={450} startBand={sign.startBand} endBand={sign.endBand} type={sign.type}/>}
              <CheckboxListSecondary itemStory={roi} setItem={setRoi} submitFunc={upload}/>
            </Stack>

            <Stack direction="row" spacing={2}>
              <SelectStatic 
                menuItems={smoothMethods}
                value={sign.filter}
                handleChange={(e) => setSign({ ...sign, filter: e.target.value })}
                title="Сглаживание"
                nullElem={true}
              />
              <SmartInput
                pressChannel={setSmartSpectre}
                title={'Cпектральная сигнатура'}
                value={sign.spectres.map((item) => `${item.x},${item.y}`).join(" | ")}
              />
            </Stack>
          </>,
          ['Совмещение']: <>
            <HintsStepper steps={stepperContent.tir}/>
            <Stack direction="row" spacing={2}>
              <SmartInput
                width={400}
                pressChannel={setSmartSpectre}
                title={'Точки HSI'}
                value={sign.spectres.map((item) => `${item.x},${item.y}`).join(" | ")}
              />
              <SmartInput
                width={400}
                pressChannel={setSmartSpectre}
                title={'Точки TIR'}
                value={sign.spectres.map((item) => `${item.x},${item.y}`).join(" | ")}
              />
              <Button>Совместить</Button>
            </Stack>
            <br/><br/>
            <Stack direction="row" spacing={2}>
              {hmap.tir && hmapComponent({w: 550, h: 412, thr: false, z_data: hmap.tir.data})}
                
              {hmap.tir && histogramComponent(undefined, undefined, hmap.tir.hist, hmap.tir.bins)}

            </Stack>
              
          </>,

          ['ML кластеризация']: <>
            <HintsStepper steps={stepperContent.cluster}/>
            <Stack direction="row" spacing={2}>
              <SelectStatic 
                menuItems={clusterContent} 
                value={hmap.expression} 
                handleChange={e => setHmap({...hmap, expression: e.target.value})} 
                title='Кластеризация'
              />
              <SmartInput pressChannel={startClasterization} defaultValue='5' title='Количество классов'/>
            </Stack>
            <Stack direction="row" spacing={2}>
              {hmap.channel && hmapComponent({w: 450, h: 400, thr: false, z_data: hmap.fastClusterIndx.channel, func: null})}
              {hist[hist.mode].bins && histogramComponent()}
            </Stack>
          </>,
          ['Относительный индекс']: <>
            <HintsStepper steps={stepperContent.spectral}/>
            <Stack direction="row" spacing={2}>
            <Stack spacing={2}>
              <SelectStatic 
                menuItems={classificationSelectItems} 
                value={method} 
                handleChange={e => setMethod(e.target.value)} 
                title='Метод'
              />
              <SmartInput
                width={300}
                pressChannel={setSmartSpectre}
                title={'Cпектральная сигнатура'}
                value={sign.spectres.map((item) => `${item.x},${item.y}`).join(" | ")}
              />
            </Stack>

              {hist[hist.mode].bins && histogramComponent()}
            </Stack>
            <Stack direction="row" spacing={2}>
              {hmap.channel && hmapComponent({w: 450, h: 400, z_data: hmap.relativeIndx.channel, func: getSpectreClass})}
              {sign.active && <LinePlot data={sign.spectres} height={400} width={500} startBand={sign.startBand} endBand={sign.endBand} type={sign.type}/>}
            </Stack>
          </>,
          ['Поиск эталонов']: <>
            <HintsStepper steps={stepperContent.etalon}/>
            <Stack direction="row" spacing={2}>
              <SelectStatic 
                menuItems={etalonContent} 
                value={hmap.expression} 
                handleChange={e => setHmap({...hmap, expression: e.target.value})} 
                title='Поиск классов'
              />
              <SelectStatic 
                menuItems={mapsMethods} 
                value={etalon_map} 
                handleChange={e => setHmap({...hmap, expression: e.target.value})} 
                title='Карты изобилия'
              />
              <SmartInput pressChannel={startClasterization} defaultValue='5' title='Кол-во классов' width={200}/>
              <SmartInput
                pressChannel={setSmartSpectre}
                title={'Координаты эталонов'}
                value={sign.spectres.map((item) => `${item.x},${item.y}`).join(" | ")}
              />
            </Stack>

            <Stack direction="row" spacing={2}>
              {hmap.channel && hmapComponent({w: 450, h: 400})}
              {sign.active && <LinePlot data={sign.spectres} height={400} width={500} startBand={sign.startBand} endBand={sign.endBand} type={sign.type}/>}
            </Stack>
          </>,
          
          ['EMD']: <>
          <HintsStepper steps={stepperContent.emd}/>
            <Stack direction="row" spacing={2}>
              <SmartInput
                pressChannel={getEMD}
                title={'Кол-во мод'}
                value={`${hmap.emd.number_of_modes}`}
              />
              <SmartInput
                pressChannel={getEMD}
                title={'Размер окна'}
                value={`${hmap.emd.windows_size}`}
              />
              <SmartInput
                pressChannel={e => {e.key == "Enter" && setHmap({...hmap, emd: {...hmap.emd, n_band: e.target.value}})}}
                title={'Номер канала'}
                value={`${hmap.emd.n_band}`}
              />
              <SmartInput
                pressChannel={e => {e.key == "Enter" && setHmap({...hmap, emd: {...hmap.emd, n_mode: e.target.value}})}}
                title={'Номер моды'}
                value={`${hmap.emd.n_mode}`}
              />
            </Stack>
            <Stack direction="row" spacing={2}>
              {hmap.emd.channel && hmapComponent({w: 450, h: 400, thr: false, z_data: hmap.emd.channel})}
              {hist[hist.mode].bins && histogramComponent()}
            </Stack>
          </>,
          ['Синтез RGB']: <>
          <HintsStepper steps={stepperContent.rgb}/>
          <Stack direction="row" spacing={2}>
            <SmartInput
              pressChannel={e => {e.key == "Enter" && setRgbTrack({...rgbTrack, blue_mode: e.target.value})}}
              title={'Синий канал'}
              value={`${rgbTrack.blue_mode}`}
            />
            <SmartInput
              pressChannel={e => {e.key == "Enter" && setRgbTrack({...rgbTrack, green_mode: e.target.value})}}
              title={'Зеленый канал'}
              value={`${rgbTrack.green_mode}`}
            />
            <SmartInput
              pressChannel={e => {e.key == "Enter" && setRgbTrack({...rgbTrack, red_mode: e.target.value})}}
              title={'Красный канал'}
              value={`${rgbTrack.red_mode}`}
            />

          </Stack>
            {rgbTrackComponent}
          <Stack direction="row" spacing={2}>
            {/* {hmap.rgb && <Rgb rgb={hmap.rgb} />} */}
            {rgbTrack.rgb && <Rgb rgb={rgbTrack.rgb} />}
          </Stack>
        </>,
          ['Кластеризация']: <>
            <HintsStepper steps={stepperContent.cluster_2}/>
            <Stack direction="row" spacing={2}>
              <SelectStatic 
                menuItems={clusterContent_2} 
                value={hmap.clusterIndx.method} 
                handleChange={e => setHmap({...hmap, clusterIndx: {...hmap.clusterIndx, method: e.target.value}})} 
                title='Алгоритм'
              />
              <SelectStatic 
                menuItems={clusterMetrics} 
                value={hmap.clusterIndx.metrics} 
                handleChange={e => setHmap({...hmap, clusterIndx: {...hmap.clusterIndx, metrics: e.target.value}})} 
                title='Метрика'
              />
              <SmartInput
                pressChannel={setSmartSpectre}
                title={'Каналы'}
              />
              <SmartInput
                pressChannel={startCluster2}
                title={'Порог / кол-во кластеров'}
                value={`${hmap.clusterIndx.thr}`}
              />
            </Stack>
            <Stack direction="row" spacing={2}>
              {hmap.clusterIndx.channel && hmapComponent({w: 450, h: 400, thr: false, z_data: hmap.clusterIndx.channel})}
              {hist[hist.mode].bins && histogramComponent()}
              {/* {hmap.clusterIndx.centroids.length && <LinePlot data={hmap.clusterIndx.centroids} height={400} width={500} startBand={sign.startBand} endBand={sign.endBand} type={sign.type}/>} */}
            </Stack>
          </>,
          
          ['Матрица кросс-корреляции']: <>
          <HintsStepper steps={stepperContent.cluster_corr}/>
          <Button onClick={e => startClusterCorr('centroids')}>Центроиды</Button>
          <Button onClick={e => startClusterCorr('medoids')}>Медоиды</Button>
            <Stack direction="row" spacing={2}>
              {hmap.clusterIndx.mx_corr.channel && hmapComponent({w: 350, h: 300, thr: false, z_data: hmap.clusterIndx.mx_corr.channel, correlation: true, x_title: hmap.clusterIndx.mx_corr.mode})}
              {hist[hist.mode].bins && histogramComponent()}
            </Stack>
            {hmap.clusterIndx.centroids && <LinePlot data={hmap.clusterIndx[hmap.clusterIndx.mx_corr.mode]} height={300} width={800} startBand={sign.startBand} endBand={sign.endBand} type={sign.type}/>}

          </>,
          ['Релеевское рассеяние']: <>
          <HintsStepper steps={stepperContent.reley}/>
          <Stack direction="row" spacing={2}>
            <Button onClick={startReley}>Рассчитать релеевское рассеяние</Button>
            <Button>Вычесть релеевское рассеяние</Button>

            <SmartInput
              pressChannel={startSigma}
              title={'Значение сигма'}
              value={`${hmap.sigma.value}`}
            />
            <Button>Отфильтровать</Button>
          </Stack>
          <Stack spacing={2}>
            {hmap.reley.spectres && <LinePlot data={hmap.reley.spectres} height={300} width={800} startBand={sign.startBand} endBand={sign.endBand} type={sign.type}/>}
            {hmap.sigma.spectres && <LinePlot data={hmap.sigma.spectres} height={300} width={800} startBand={sign.startBand} endBand={sign.endBand} type={sign.type}/>}
          </Stack>

          </>,
          
          ['Температурная карта']: 'В разработке',
          ['Предсказание дня засухи']: 'В разработке',
        }}/>

      </Stack>
      
    </div>
  )
}

export default Menu

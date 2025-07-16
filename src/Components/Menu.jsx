import { useState, useEffect } from 'react'
import { useLoaderData } from 'react-router-dom'
import * as XLSX from 'xlsx'

import MouseTooltip from 'react-sticky-mouse-tooltip';

import Rgb from './plots/Rgb.jsx'

import Stack from "@mui/material/Stack";

import SmartInput from "./mui/SmartInput";
import SelectStatic from './mui/SelectStatic.jsx'
import Track from "./mui/Track";
import LeftMenu from './mui/LeftMenu.jsx'
import HintsStepper from './mui/HintsStepper.jsx';
import ContentTabs from './mui/ContentTabs.jsx';
import CheckboxDown from './mui/CheckboxDown.jsx';
import OpenDialog from './mui/OpenDialog.jsx';
import CheckboxListSecondary from './mui/CheckboxListSecondary.jsx'
import RenderGroup from './mui/RenderGroup.jsx';
import SaveMenu from './mui/SaveMenu.jsx';

import HistPlot from './plots/HistPlot.jsx';
import Heatmap from "./plots/Heatmap";
import LinePlot from './plots/LinePlot'
// import Hmap from './plots/Hmap.jsx';

import getFetch from '../Functions/getFetch.js'
import getRandomColor from '../Functions/getRandomColor.js'
import str2Numbers from '../Functions/str2numbers.js';

import DashboardIcon from '@mui/icons-material/Dashboard';
import { Button } from '@mui/material';
import Slider3 from './mui/Slider3.jsx';
import IndexField from './mui/IndexField.jsx';
import LaptopChromebookIcon from '@mui/icons-material/LaptopChromebook';
import SaveIcon from '@mui/icons-material/Save';
import RoiList from './mui/RoiList.jsx';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import getBlob from '../Functions/getBlob.js';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeStandbyIcon from '@mui/icons-material/ModeStandby';
import RectangleIcon from '@mui/icons-material/Rectangle';

// import { ScrollContainer } from 'react-indiana-drag-scroll'
import ScrollContainer from 'react-indiana-drag-scroll';


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

const addImageOptions = [
  {
    group: 'Спектрограмма',
    label: 'Среднее',
    value: 'mean'
  },
  {
    group: 'Спектрограмма',
    label: 'Максимум',
    value: 'max'
  },
  {
    group: 'Спектрограмма',
    label: 'Минимум',
    value: 'min'
  },
  {
    group: 'Спектрограмма',
    label: 'Ср.отклонение',
    value: 'std'
  },
  {
    group: 'Спектрограмма',
    label: 'Размах',
    value: 'scope'
  },
  {
    group: 'Спектрограмма',
    label: 'Межквартильный размах',
    value: 'iqr'
  },
  {
    group: 'Спектрограмма',
    label: 'Энтропия',
    value: 'entropy'
  },
  {
    group: 'Спектрограмма',
    label: '1_квартиль',
    value: 'q1'
  },
  {
    group: 'Спектрограмма',
    label: 'Медиана',
    value: 'median'
  },
  {
    group: 'Спектрограмма',
    label: '3_квартиль',
    value: 'q3'
  },
  {
    group: 'Спектрограмма',
    label: 'Корреляция',
    value: 'matrix_correlation'
  },

  {
    group: 'Кластеризация',
    label: 'KMeans',
    value: 'kmeans'
  },
  {
    group: 'Кластеризация',
    label: 'Birch',
    value: 'birch'
  },
  {
    group: 'Кластеризация',
    label: 'SpectralClustering |',
    value: 'spectral_clustering'
  },
  {
    group: 'Кластеризация',
    label: 'AgglomerativeClustering |',
    value: 'agglomerative_clustering'
  },
  {
    group: 'Кластеризация',
    label: 'GaussianMixture |',
    value: 'gaussian_mixture'
  },
  {
    group: 'Кластеризация',
    label: 'AffinityPropagation ||',
    value: 'affinity_propagation'
  },
  {
    group: 'Кластеризация',
    label: 'OPTICS ||',
    value: 'optics'
  },
]

const statMxSelectItems = {
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
  matrix_correlation: "Корреляция",
  }

  const classificationSelectItems = {
    sam: "SAM",
    sid: "SID",
    sca: "SCA",
    chebychev: "Chebychev",
    ace: "Adaptive Cosine/coherent Estimator",
    cem: "Constrained Energy Minimization",
    // glrt: "Generalized Likelihood Ratio Test",
    mf: "Mathed Filter",
    // osp: "Orthogonal Subspace Projection"
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
  const { settings, colorsDict, serverUrl } = useLoaderData()
  const urlServer = serverUrl
  const [tab, setTab] = useState(0) // Какая вкладка открыта
  const [open, setOpen] = useState(false) // Открыто ли окно загрузки

  const [roi, setRoi] = useState(settings.rois_story.map(roi_str => ({roi_str, active: false, color: getRandomColor()})))
  const [roiList, setRoiList] = useState([{roi_str: 'x0=0,x1=511,y0=0,y1=511', active: true, color: getRandomColor()}])

  const [etalon_map, setMap] = useState(Object.keys(mapsMethods)[0])

  const [tooltip, setTooltip] = useState({visible: false, text: ''})

  const [spectrogram, setSpectogram] = useState(null)

  const [divRoi, setDivRoi] = useState({state: 0, list: [], current: 0})

  const [curRoi, setCurRoi] = useState(-1) // -1 это все изображение

  const [clickMode, setClickMode] = useState(false) // 0 - спектр, 1 - ROI

  // const [images, setImages] = useState({diskFiles, downloadedFiles})

  const [ml, setML] = useState({
    method: Object.keys(clusterContent)[0],
    segmentation: null,
    hist: null,
    bins: null
  })

  const [bands, setBands] = useState({text: 'b0', story: settings.index_story, list: [], t: 1, condition: ''})

  const [hmap, setHmap] = useState({
    nameHsi: '',
    count_bands: 204,
    channels_expr: '0-203',
    nm: [],
    roi: {x0: 0, x1: 511, y0: 0, y1: 511},
    rgb: null,
    expression: settings.channel,
    statMap: statMxSelectItems.mean,
    // statMap: Object.keys(statMxSelectItems)[2], возникают ошибки, устранить
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
    statSpectres: [],
    filter: settings.filter,
    h: settings.h,
    type: 'signal',
    active: true,
    startBand: 0,
    endBand: hmap.count_bands-1
  });
  // const [extract, setExtract] = useState([])
  // const [method, setMethod] = useState('sam')

  const [relative, setRelative] = useState({
    method: Object.keys(classificationSelectItems)[0],
    segmentation: null,
    hist: null,
    bins: null
  })
  
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

  // const pressChannel = async (e) => {
  //   // if ((e.type === "keydown" && e.key === "Enter") || e.type === "blur") {
  //     // setHmap({ ...hmap, expression: e.target.value });
  //     setSmart({...smart, indx: {...smart.indx, defaultValue: e.target.value}})
  //     await getChannel()
  //   // }
  // };

  const getEMD = async (e) => {
    if (e.key == "Enter") {
      const {emd} = await getFetch(urlServer, 'emd', {})
      setHmap({...hmap, emd})
    }
  }
  // поправить
  // useEffect(() => {
  //   if (hmap.channel) {
  //     getEMDChannel();
  //   }
  // }, [hmap.emd.n_mode, hmap.emd.n_band]);

  const getEMDChannel = async () => {
    const {emd} = await getFetch(urlServer, 'emd_channel', {n_mode: hmap.emd.n_mode, n_band: hmap.emd.n_band})
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
      if (res.length !== 0) {
        setSign({ ...sign, spectres: res });
        if (hist.mode !== 'sign') setHist({...hist, mode: 'sign'})
      }
    }
  };

  const [smart, setSmart] = useState({
    mode: 'indx',
    indx: {
      // defaultValue: settings.channel,
      // preccFunction: pressChannel,
      title: 'Умный индекс',
      story: settings.index_story,
      value: settings.index_story[5]
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
      hist: null,
      statBins: null,
      statHist: null
    },
    sign: {
      bins: ['Max', 'Min', 'Mean', 'Std', 'Scope', 'IQR', 'Q1', 'Median', 'Q3'],
      hist: null
    },
    indx_info: {
      bins: ['Max', 'Min', 'Mean', 'Std', 'Scope', 'IQR', 'Q1', 'Median', 'Q3', 'Entropy'],
      hist: null,
      statBins: ['Max', 'Min', 'Mean', 'Std', 'Scope', 'IQR', 'Q1', 'Median', 'Q3', 'Entropy'],
      statHist: null
    },
    width: 500,
    height: 200,
    color: getRandomColor()
  })

  // useEffect(() => {
  //   getStatMx(hmap.expression, tracker.boundary.min_val, tracker.boundary.max_val)
  // }, [tracker.boundary.min_val, tracker.boundary.max_val])

  const getRgb = async () => {
    const res = await getBlob(urlServer, 'rgb', {})
    const img = new Image();
    img.src = URL.createObjectURL(res);
    console.log(img)
    
    img.onload = () => {
        setBands({...bands, list: [{type: 'rgb', img: img.src, label: `${hmap.nameHsi} | ${hmap.rows}x${hmap.cols}х${hmap.count_bands}`, width: img.width, height: img.height}]})
        // document.getElementById('photo-0-img').width = img.width
        // document.getElementById('photo-0-img').height = img.height
        // document.getElementsByClassName('photo').height = img.height
        document.getElementsByClassName('card')[0].setAttribute("style",`height: ${img.height}px`);
    };
  }

  useEffect(() => {
    if (hmap.nameHsi) getRgb()
  }, [hmap.nameHsi])

  useEffect(() => {
    if (bands.list.length > 1) getHist()
  }, [bands.list])

  useEffect(() => {
    Array.from(document.getElementsByClassName('div-roi')).map(el => el.style.display = `${!clickMode || bands.list[0].type === 'spectrogram' ? 'none' : 'block'}`)
  }, [clickMode, bands.list])

  // useEffect(() => {
  //   if (hmap.mx) getStatMx(hmap.statMap, tracker.boundary.min_val, tracker.boundary.max_val)
  // }, [hmap.roi, hmap.channels_expr])

  // useEffect(() => {
  //   if (hmap.mx) {
  //     changeThr()
  //   }
  // }, [tracker.thr.min_val, tracker.thr.max_val])

  // useEffect(() => {
  //   if (bands.list.length) getStatMx(hmap.statMap, tracker.boundary.min_val, tracker.boundary.max_val)
  // }, [hmap.statMap])

  useEffect(() => {
    reloadSpectres();
  }, [sign.filter, tracker.filter.max_val]);

  // надо поправить
  // useEffect(() => {
  //   if (hmap.channel) getRgbSyn();
  // }, [rgbTrack.sliderCommit, rgbTrack.blue_mode, rgbTrack.green_mode, rgbTrack.red_mode]);

  const getRgbSyn = async () => {
    const fetch_arg = {red: rgbTrack.red, green: rgbTrack.green, blue: rgbTrack.blue}
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
    console.log(fileinfo)
    setHmap({...hmap, 
      nameHsi: fileinfo.name, 
      // rgb: fileinfo.rgb, 
      count_bands: fileinfo.count_bands, 
      rows: fileinfo.rows,
      cols: fileinfo.cols,
      bands_expr: `0-${fileinfo.count_bands-1}`, 
      nm: fileinfo.nm, 
      roi: {x0: 0, x1: fileinfo.rows, y0: 0, y1: fileinfo.cols},
      channels_expr: `0-${fileinfo.count_bands-1}`
    })
    setSign({ ...sign, endBand: fileinfo.count_bands-1});
    // setTrack({ ...tracker, boundary: {...tracker.boundary, max_lim: fileinfo.count_bands-1, max_val: fileinfo.count_bands-1}})

    // changeRoi(0, fileinfo.rows, 0, fileinfo.cols)
    // setRoiList([{roi_str: `x0=0,x1=${fileinfo.rows},y0=0,y1=${fileinfo.cols}`, active: true, color: getRandomColor()}])
  }
console.log(hmap)
console.log(sign)
  const fetchSpectre = async (x, y) => {
    return await getFetch(urlServer, 'signal', {x, y, method: sign.filter, h: tracker.filter.max_val})
  };

  const pushSpectre = async (e) => {
    // const { x, y } = e.points[0];
    const x = Math.round(e.clientX - document.getElementById('photo-0-img').getBoundingClientRect().left)
    const y = Math.round(e.clientY - document.getElementById('photo-0-img').getBoundingClientRect().top)
    console.log(x, y)
    const signData = await fetchSpectre(x, y);
    setSign({...sign, spectres: [...sign.spectres, { ...signData, x, y, color: getRandomColor() }] });
    if (hist.mode !== 'sign') setHist({...hist, mode: 'sign'})
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
    let start = hmap.nm.map((val, indx) => ({ band: indx, nm: val }));
    sign.spectres.forEach((spec) => {
      start = start.map((item, indx) => ({
        ...item,
        [`${spec.x},${spec.y}`]: spec[sign.type].sign[indx],
      }));
    });
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(start);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
    XLSX.writeFile(wb, "Спектры.xlsx");
  };

  const saveMx2Table = async e => {

    const res = await getFetch(urlServer, 'save_band', {expr: bands.list[0].expr})
    console.log(res)
    
    // const wb = XLSX.utils.book_new();
    
    // let mx = hmap.mx.channel
    // let start = hmap.nm.map((val, indx) => ({ [val]: mx[indx] }));
    // hmap.nm.forEach((val, indx) => {
    //   start = start.map((item, j) => ({
    //     ...item,
    //     [val]: mx[indx][j]
    //   }))
    // })
    // const ws = XLSX.utils.json_to_sheet(start);
    // XLSX.utils.book_append_sheet(wb, ws, "Матрица");

    // let ms = sign.statSpectres[0][sign.type].sign
    // console.log(ms)
    // let ms_data = hmap.nm.map((val, indx) => ({ band: indx, nm: val, [hmap.statMap]: ms[indx] }));
    // const ms_sheet = XLSX.utils.json_to_sheet(ms_data);
    // XLSX.utils.book_append_sheet(wb, ms_sheet, "Спектр");
    
    // XLSX.writeFile(wb, "Спектрограмма.xlsx");
  }
  
  const getChannel = async (expression = undefined) => {
    // const { data, max, min, ...info} = await getFetch(urlServer, 'bands', {expr: smart.indx.defaultValue})
    const expr_conditional = (expression ? expression : bands.text)
    const expr_decomposition = expr_conditional.includes('<') ? expr_conditional.split('<') : expr_conditional.split('>')
    console.log(expr_decomposition)

    const expr = expr_decomposition[0]
    const t = expr_decomposition.length !== 1 ? parseFloat(expr_decomposition[1]) : bands.t
    const condition = expr_conditional.includes('<') ? 'lower' : (expr_conditional.includes('>') ? 'upper' : '')
    
    
    const res = await getBlob(urlServer, 'bands_png', {expr, t, condition})
    const img = new Image();
    img.src = URL.createObjectURL(res);
    console.log(img)
    
    img.onload = () => {
      setBands({...bands, list: [{img: img.src, type: 'band', label: `${expr} | t: ${t}`, width: img.width, height: img.height, expr}, ...bands.list], t})
    }
    
    setHist({...hist, indx: {...hist.indx, ...info}})
  };

  const getHist = async () => {
    const {signal, diff, ...info} = await getFetch(urlServer, 'hist', {})
    console.log(info)

    setHist({...hist, indx: {...hist.indx, ...info}, mode: 'indx'})
    if (diff) setSign({...sign, spectres: [{ signal, diff, x: -1, y: -1, color: getRandomColor() }] });
    // setSign({...sign, startBand, endBand, spectres: [{signal: {sign: mxInfo['signal'].sign}, diff: {sign: mxInfo['diff'].sign}, x: -1, y: -1, name, color: getRandomColor(), ...mxInfo}]})

  }

  const thresholding = (arr) => {
    // Маскирование двумерного массива
    if (!hmap.hiddenMask) return arr
    return arr.map((row) =>
      row.map((item) => (tracker.thr.min_val <= item && item <= tracker.thr.max_val) || item == 0 ? item : null));
  };

  // const changeThr = async () => {
  //   const res = await getFetch(urlServer, 'change_thr', {thr_expr: smart.indx.defaultValue, lower: tracker.thr.min_val, upper: tracker.thr.max_val})
  //   console.log(res)
  //   await getStatMx(hmap.statMap, tracker.boundary.min_val, tracker.boundary.max_val)
  // }

  const getStatMx = async (name=hmap.expression) => {
    // const mxInfo = await getFetch(urlServer, 'idx_mx', {name, startBand, endBand})
    const res = await getBlob(urlServer, 'idx_mx', {name})
    const img = new Image();
    img.src = URL.createObjectURL(res);
    console.log(img)

    
    const scale_factor =  hmap.rows / hmap.count_bands
    img.onload = () => {
      const expr = addImageOptions.filter(option => option.value === name)[0].label
      setBands({...bands, list: [{type: 'spectrogram', img: img.src, label: `${expr} | по ${curRoi === -1 ? 'HSI' : `ROI №${curRoi}`} | t: ${bands.t}`, width: hmap.rows, height: hmap.rows, expr: name}, ...bands.list]})
      setSpectogram({img: img.src, width: img.width, height: img.height, scale: scale_factor})
    }

    // console.log(mxInfo)
    // setHmap({...hmap, mx: {channel: mxInfo[sign.type].idx_mx.data, expression: name, hist: mxInfo[sign.type].idx_mx.hist, bins: mxInfo[sign.type].idx_mx.bins}})
    
    // setSign({...sign, startBand, endBand, spectres: [{signal: {sign: mxInfo['signal'].sign}, diff: {sign: mxInfo['diff'].sign}, x: -1, y: -1, name, color: getRandomColor(), ...mxInfo}]})
    // setSign({...sign, statSpectres: [{signal: {sign: mxInfo['signal'].sign}, diff: {sign: mxInfo['diff'].sign}, x: -1, y: -1, name, color: getRandomColor(), ...mxInfo}]})


  //   setHist({...hist, indx: {
  //     ...hist.indx, 
  //     statHist: mxInfo[sign.type].idx_mx.hist, 
  //     statBins: mxInfo[sign.type].idx_mx.bins,
  //   },
  // })
  }

  const getSpectreClass = async e => {
    const { x, y } = e.points[0]
    const result = await getFetch(urlServer, 'classes', {method: relative.method, x, y})
    
    // setHist({...hist, indx: {...hist.indx, ...info}})
    setRelative({...relative, segmentation: result.data, ...result})
    console.log(result)
    // setTrack({
    //   ...tracker, 
    //   thr: {
    //     ...tracker.thr,
    //     min_lim: Math.floor(result.min * 100) / 100, 
    //     max_lim: Math.ceil(result.max * 100) / 100,
    //     min_val: Math.floor(result.min * 100) / 100,
    //     max_val: Math.ceil(result.max * 100) / 100
    //   }
    // })

    await pushSpectre(e)
  }
  console.log(relative)

  const startReley = async (e) => {
    const {reley} = await getFetch(urlServer, 'reley', {})
    setHmap({...hmap, reley: {...hmap.reley, spectres: reley.map(el => ({...el, x: -1, y: -1, color: getRandomColor()}))}})
    // setHist({...hist, indx: {...hist.indx, hist: result.hist, bins: result.bins}})
  }

  const startSigma = async (e) => {
    if (e.key === 'Enter') {
      const {sigma} = await getFetch(urlServer, 'sigma', {sigma: e.target.value})
      setHmap({...hmap, sigma: {...hmap.sigma, spectres: sigma.map(el => ({...el, x: -1, y: -1, color: getRandomColor()}))}})
      // setHist({...hist, indx: {...hist.indx, hist: result.hist, bins: result.bins}})
    }
  }

  const startClusterCorr = async (mode='centroids') => {
    const result = await getFetch(urlServer, 'clusters_corr', {mode})
    setHmap({...hmap, clusterIndx: {...hmap.clusterIndx, mx_corr: {...hmap.clusterIndx.mx_corr, channel: result.segmentation, mode: result.mode, hist: result.hist, bins: result.bins}}})
    setHist({...hist, indx: {...hist.indx, hist: result.hist, bins: result.bins}})
  }

  const startCluster2 = async e => {
    if (e.key === 'Enter') {
      const result = await getFetch(urlServer, 'clusters_2', {thr: e.target.value, method: hmap.clusterIndx.method, metrics: hmap.clusterIndx.metrics})
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
        const {endmembers} = await getFetch(urlServer, 'endmembers', {k: e.target.value, method: hmap.expression})

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

        const {amaps} = await getFetch(urlServer, 'amaps', {method: etalon_map, endmembers})
        console.log(amaps)
        
        setHmap({...hmap, channel: amaps[0].data, hist: amaps[0].hist, bins: amaps[0].bins})
      }
      else {
        const result = await getFetch(urlServer, 'clusters', {k: e.target.value, method: ml.method})

        setML({...ml, segmentation: result.segmentation, hist: result.hist, bins: result.bins})
      }
    }
  }

  const changeChannels = async channels_expr => {
    const fileinfo = await getFetch(serverUrl, 'change_channels', {channels_expr})
    await reloadSpectres()
    setHmap({...hmap, channels_expr, nm: fileinfo.nm})
  }

  const changeRoi = async (x0, x1, y0, y1) => {
    const text = `x: ${x0} - ${x1}, y: ${y0} - ${y1}`
    const currentRoi = divRoi.list[curRoi]
    const changedRoi = {x0, y0, x1, y1, color: currentRoi.color, text}
    setDivRoi({...divRoi, list: [...divRoi.list.map(el => el !== currentRoi ? el : changedRoi)]})
    
    const div = document.getElementById(`roi-${curRoi}`)
    div.style.marginLeft = `${x0}px`
    div.style.marginTop = `${y0}px`
    div.style.height = `${y1 - y0 - 5}px`
    div.style.width = `${x1 - x0 - 5}px`
    div.addEventListener('mousemove', e => setTooltip({...tooltip, visible: true, text: `ROI №${curRoi} ` + text}))

    await getFetch(serverUrl, 'change_roi', {x0, x1, y0, y1})
    // if (fileinfo === null) {
    //   setHmap({...hmap, roi: {...hmap.roi, x0, x1, y0, y1}})
    // }
  }

  const openFromPC = async e => {
    const fileinfo = await getFetch(serverUrl, 'convert', {})
    console.log(fileinfo)
    setHmap({...hmap, 
      nameHsi: fileinfo.name,
      count_bands: fileinfo.count_bands,
      rows: fileinfo.rows,
      cols: fileinfo.cols,
      nm: fileinfo.nm, 
      roi: {x0: 0, x1: fileinfo.rows, y0: 0, y1: fileinfo.cols},
      channels_expr: `0-${fileinfo.count_bands-1}`
    })
    setSign({ ...sign, endBand: fileinfo.count_bands-1});
    // setTrack({ ...tracker, boundary: {...tracker.boundary, max_lim: fileinfo.count_bands-1, max_val: fileinfo.count_bands-1}})

    // changeRoi(0, fileinfo.rows, 0, fileinfo.cols)
    // setRoiList([{roi_str: `x0=0,x1=${fileinfo.rows},y0=0,y1=${fileinfo.cols}`, active: true, color: getRandomColor()}])
  }

  const saveStorage = async e => {
    const fileinfo = await getFetch(serverUrl, 'save_convert', {})
    console.log(fileinfo)
  }

  const navigation = [
    {
      title: 'Хранилище HSI',
      type: 'button',
      icon: <DashboardIcon />,
      click: e => setOpen(true),
      openedAfterClick: true,
      content: <OpenDialog open={open} setOpen={setOpen} url={serverUrl} openImg={openImg}/>
    },
    {
      title: 'Открыть с компьютера',
      type: 'button',
      icon: <LaptopChromebookIcon />,
      click: openFromPC,
      openedAfterClick: false
    },
    {
      title: 'Сохранить в хранилище',
      type: 'button',
      icon: <SaveIcon />,
      click: saveStorage,
      openedAfterClick: false
    },
    // {
    //   title: 'coloring',
    //   type: 'list',
    //   content: <SelectStatic 
    //               menuItems={colorsDict} 
    //               value={hmap.colormap} 
    //               handleChange={e => setHmap({...hmap, colormap: e.target.value})} 
    //               title='Цветовая палитра'
    //             />
    // },
  ];

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

    const mainRoi = {
      type: 'rect',
      y0: hmap.roi.x0,
      y1: hmap.roi.x1,
      x0: hmap.roi.y0,
      x1: hmap.roi.y1,
      line: {
        color: 'black'
      }
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
    
    return points.concat(tab === 2 ? rectangles : []).concat(mainRoi)
  }

  const hmapComponent = (parameters={}) => {
    const {w=580, h=400, thr=true, z_data=hmap.channel, func=pushSpectre, correlation=false, x_title='', shapes=convert2Shapes(), mask=hmap.hiddenMask} = parameters
    return <Heatmap 
      z={thr ? thresholding(z_data) : z_data} 
      clickFunc={func}
      color={hmap.colormap} 
      flagNull={mask} 
      type={hmap.type} 
      width={w}
      height={h} 
      shapes={shapes}
      correlation={correlation}
      x_title={x_title}
    />
  }

  const histogramComponent = (parameters={}) => {
  const {w=hist.width, h=hist.height, hist_band=hist[hist.mode].hist, bins_band=hist[hist.mode].bins, spectres=sign.spectres} = parameters
  return <HistPlot 
    hist={hist.mode !== 'sign' ? [{data: hist.mode === 'indx' ? hist_band : [hist.indx.max, hist.indx.min, hist.indx.mean, hist.indx.std, hist.indx.scope, hist.indx.iqr, hist.indx.q1, hist.indx.median, hist.indx.q3, hist.indx.entropy], color: hist.color}] : 
    spectres.map(spectre => ({
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
  />}
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
  
  const linePlotComponent = (parameters={}) => {
    const {w=500, h=500, type=sign.type, startBand=sign.startBand, endBand=sign.endBand, data=sign.spectres} = parameters
    return <LinePlot data={data} height={h} width={w} startBand={startBand} endBand={endBand} type={type} nm={hmap.nm}/>
  }

  const getXEvent = e => {
    return Math.round(e.clientX - document.getElementById('photo-0-img').getBoundingClientRect().left)
  }

  const getYEvent = e => {
    return Math.round(e.clientY - document.getElementById('photo-0-img').getBoundingClientRect().top)
  }

  const createRoi = e => {
    const x = getXEvent(e)
    const y = getYEvent(e)

    const div = document.createElement('div')
    div.id = `roi-${divRoi.list.length}`
    div.className = 'div-roi'
    
    // const card = document.getElementsByClassName('card')[0]
    const card = document.getElementsByClassName('indiana-scroll-container--hide-scrollbars')[0]
    console.log(div)
    console.log(card)
    divRoi.currentColor = getRandomColor()
    div.style.border = `${divRoi.currentColor} 3px solid`
    div.style.backgroundColor = '#00ffff47'
    div.style.position = 'absolute'
    div.style.marginLeft = `${x}px`
    div.style.marginTop = `${y}px`
    div.style.height = '0px'
    div.style.width = '0px'
    card.append(div)

    setDivRoi({...divRoi, state: 1})
  }

  const resizeRoi = e => {
    const x = getXEvent(e)
    const y = getYEvent(e)

    const div = document.getElementById(`roi-${divRoi.list.length}`)
    const x0 = parseInt(div.style.marginLeft)
    const y0 = parseInt(div.style.marginTop)

    div.style.height = `${y - y0 - 10}px`
    div.style.width = `${x - x0 - 10}px`
  }

  const saveRoi = async e => {
    const x = getXEvent(e)
    const y = getYEvent(e)

    const id = divRoi.list.length
    const div = document.getElementById(`roi-${id}`)
    const x0 = parseInt(div.style.marginLeft)
    const y0 = parseInt(div.style.marginTop)

    const height = y - y0
    const width = x - x0
    if (height < 10 || width < 10) {
      div.remove()
      setDivRoi({...divRoi, state: 0})
      return
    }
    div.style.height = `${height - 10}px`
    div.style.width = `${width - 10}px`

    const text = `x: ${x0} - ${x - 5}, y: ${y0} - ${y - 5}`
    const changeRoiFunc = async () => await getFetch(serverUrl, 'change_roi', {x0, x1: x - 5, y0, y1: y - 5})
    setDivRoi({state: 0, list: [...divRoi.list, {x0, y0, x1: x - 5, y1: y - 5, color: divRoi.currentColor, text, changeRoiFunc}], current: divRoi.current + 1})
    setCurRoi(id)

    div.addEventListener('mousemove', e => setTooltip({...tooltip, visible: true, text: `ROI №${id} ` + text}))
    div.addEventListener('click', async e => {setCurRoi(id); await changeRoiFunc()})

    await changeRoiFunc()
  }

  const delRoi = e => {
    if (curRoi !== -1) {
      setDivRoi({...divRoi, list: [...divRoi.list.filter(el => el !== divRoi.list[curRoi])]})
      setCurRoi(-1) 

      document.getElementById(`roi-${curRoi}`).remove()
    }
  }

  const tooltipTextMx = e => {
    const x = Math.round((e.clientX - document.getElementById('photo-0-img').getBoundingClientRect().left) / spectrogram.scale)
    const y = Math.round((e.clientY - document.getElementById('photo-0-img').getBoundingClientRect().top) / spectrogram.scale)
    const nmX = hmap.nm[x]
    const nmY = hmap.nm[y]
    return `x: ${x}, y: ${y}, nm(x): ${nmX}, nm(y): ${nmY}`
  }

  const addImagePressButton = async e => {
    const stringSplit = e.target.value.split(' ')

    if (stringSplit.length === 1) {
      const addImageOptionsElement = addImageOptions.filter(option => option.label === e.target.value)[0]
      if (addImageOptionsElement.group === 'Спектрограмма') getStatMx(addImageOptionsElement.value)
    }

    else if (stringSplit.length === 2)
    {
      const [method, k] = stringSplit
  
      const res = await getBlob(urlServer, 'clusters', {k: Number(k), method: addImageOptions.filter(option => option.label === method)[0].value})
      const img = new Image();
      img.src = URL.createObjectURL(res);
      console.log(img)

      img.onload = () => {
        setBands({...bands, list: [{img: img.src, type: 'band', label: `Метод: ${method} | k = ${k}`, width: img.width, height: img.height}, ...bands.list]})
      }

      // setML({...ml, segmentation: result.segmentation, hist: result.hist, bins: result.bins})
      
  }
      // setML({...ml, method: e.target.value})
  }
  
  return (
    <div className="page">
      <Stack>
        <IndexField 
          menuComponent={<LeftMenu navigation={navigation}/>} 
          defaultValue={bands.text}
          pressEnter={async e => e.key == "Enter" && getChannel(e.target.value)}
          story={bands.story}
          buttonClear={e => setBands({...bands, list: [...bands.list.filter(el => el.type === 'rgb')]})}
          button3d={e => setHmap({...hmap, type: hmap.type === 'heatmap' ? 'surface' : 'heatmap'})}
          derivButton={e => setSign({...sign, type: sign.type === 'signal' ? 'diff' : 'signal'})}
          backgButton={e => setHmap({...hmap, hiddenMask: !hmap.hiddenMask})}
          component1={<RenderGroup options={addImageOptions} pressEnter={e => e.key == "Enter" && addImagePressButton(e)}/>}
          component2={<SmartInput
            width={250}
            pressChannel={async e => e.key == "Enter" && changeChannels(e.target.value)}
            title={'Область спектрального интереса'}
            value={hmap.channels_expr}
            type='text'
          />}
          component3={<SmartInput
            width={250}
            pressChannel={e => e.key == "Enter" && changeRoi(...str2Numbers(e.target.value))}
            title={`ROI | ${curRoi !== -1 ? curRoi : 'HSI'}`}
            value={curRoi !== -1 ? divRoi.list[curRoi].text : `x: ${0} - ${hmap.cols}, y: ${0} - ${hmap.rows}`}
            type='text'
          />}
          component4={<IconButton color="primary" sx={{ p: '10px' }} aria-label="directions" onClick={async e => {delRoi(e); await getFetch(serverUrl, 'change_roi', {x0: 0, x1: hmap.cols, y0: 0, y1: hmap.rows})}}>
            <DeleteIcon /> 
          </IconButton>}
          component5={<SaveMenu saveButtons={[
                  {
                      title: 'Сохранить спектры',
                      onClick: saveSpectre2Xlsx
                  },
                  {
                      title: 'Сохранить изображение',
                      onClick: saveMx2Table
                  },
              ]}/>
          // <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions" onClick={saveMx2Table}>
          //   <SaveIcon /> 
          // </IconButton>
          }
          buttonClickMode={<IconButton color="primary" sx={{ p: '10px' }} aria-label="directions" onClick={e => setClickMode(!clickMode)}>
            {clickMode ? <RectangleIcon/> : <ModeStandbyIcon />}
            {/* div.style.display = `${clickMode ? 'block' : 'none'}`  */}
          </IconButton>}
        />

        <div className='card'>
            <ScrollContainer className="photo">
                {bands.list.map((el, i) => 
                (<div className="photo-item" key={`band_img_${i}`} id={`photo-${i}`}>
                  <img 
                  width={el.width}
                  height={el.height}
                  id={`photo-${i}-img`}
                  src={`${el.img}`} 
                  alt="Контрастное изображение" 
                  // onError={(e) => {
                  // e.target.onerror = null; 
                  // e.target.src = '/fallback-image.jpg'; // Запасное изображение при ошибке
                  // }}
                  onClick={
                    e => i === 0 
                    ? clickMode && el.type !== 'spectrogram' ? (!divRoi.state ? createRoi(e) : saveRoi(e)) : (el.type !== 'spectrogram' && pushSpectre(e))
                    : setBands({...bands, list: [bands.list[i], ...bands.list.filter((val, indx) => indx !== i)]})
                  }
                  onMouseMove={e => i === 0 && (divRoi.state == 1 ? resizeRoi(e) : setTooltip({...tooltip, visible: true, text: el.type !== 'spectrogram' ? `x: ${getXEvent(e)}, y: ${getYEvent(e)}` : tooltipTextMx(e)}))}
                  onMouseLeave={e => i === 0 && tooltip.visible && setTooltip({...tooltip, visible: false, text: ''})}
                  // onMouseDown={e => console.log('sdfsaf')}
                  />
                  <br/>
                  <div className='label-container'>
                    <label className='label-item'>{el.label}</label>
                  </div>
              </div>))}
            </ScrollContainer>
          </div>

      </Stack>

      <Stack direction="row" spacing={2}>
        <ContentTabs value={tab} setValue={setTab} buttonsFunc={[undefined, e => saveMx2Table(), undefined, e => openTir('3.xlsx')]} content_obj={{
          ['Визуализация']: <>
              <Stack direction="row" spacing={2}>
                {sign.spectres.length !== 0 && linePlotComponent({w: 1000, h: 450})}
                {hist[hist.mode].bins && histogramComponent({w:1000, h:250})}
              </Stack>

              <Stack direction="row" spacing={2}>
                <SmartInput
                  pressChannel={setSmartSpectre}
                  title={'Cпектральная сигнатура'}
                  value={sign.spectres.map((item) => `${item.x},${item.y}`).join(" | ")}
                  width={900}
                  />

                {/* <SelectStatic
                  menuItems={statMxSelectItems}
                  value={hmap.statMap}
                  // handleChange={e => getStatMx(e.target.value)}
                  handleChange={e => setHmap({...hmap, statMap: e.target.value})}
                  title='Спектрограмма'
                /> */}

                <SelectStatic 
                  menuItems={smoothMethods}
                  value={sign.filter}
                  handleChange={(e) => setSign({ ...sign, filter: e.target.value })}
                  title="Сглаживание"
                  nullElem={true}
                />
                
                {trackComponent('filter')}
                <SelectStatic 
                    menuItems={{indx: 'HSI индекс', sign: 'Статистика спектров', indx_info: 'Статистика HSI индекса'}} 
                    value={hist.mode} 
                    handleChange={e => setHist({...hist, mode: e.target.value})} 
                    title='Гистограмма'
                  />
              </Stack>

              {/* <CheckboxListSecondary itemStory={roi} setItem={setRoi} submitFunc={upload}/> */}
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
                
              {hmap.tir && histogramComponent({hist_band: hmap.tir.hist, bins_band: hmap.tir.bins})}

            </Stack>
              
          </>,

          ['Относительный индекс']: <>
            <HintsStepper steps={stepperContent.spectral}/>
            <Stack direction="row" spacing={2}>
            <Stack spacing={2}>
              <SelectStatic 
                menuItems={classificationSelectItems} 
                value={relative.method} 
                handleChange={e => setRelative({...relative, method: e.target.value})} 
                title='Метод'
              />
              <SmartInput
                width={300}
                pressChannel={setSmartSpectre}
                title={'Cпектральная сигнатура'}
                value={sign.spectres.map((item) => `${item.x},${item.y}`).join(" | ")}
              />
            </Stack>

              {relative.bins && histogramComponent({hist_band: relative.hist, bins_band: relative.bins})}
            </Stack>
            <Stack direction="row" spacing={2}>
              {hmap.channel && hmapComponent({w: 450, h: 400, z_data: relative.segmentation || hmap.channel, func: getSpectreClass})}
              {sign.active && linePlotComponent({h: 400})}
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
              {sign.active && linePlotComponent({h: 400})}
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
              {hmap.clusterIndx.channel && hmapComponent({w: 450, h: 400, thr: false, z_data: hmap.clusterIndx.channel, shapes: null, mask: false})}
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
            
            {hmap.clusterIndx.centroids && linePlotComponent({h: 300, w: 800, data: hmap.clusterIndx[hmap.clusterIndx.mx_corr.mode]})}

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
            {hmap.reley.spectres && linePlotComponent({h: 300, w: 800, data: hmap.reley.spectres})}
            {hmap.sigma.spectres && linePlotComponent({h: 300, w: 800, data: hmap.sigma.spectres})}
          </Stack>

          </>,
          
          ['Температурная карта']: 'В разработке',
          ['Предсказание дня засухи']: 'В разработке',
        }}/>

      </Stack>
        <MouseTooltip
          visible={tooltip.visible}
          offsetX={15}
          offsetY={10}
        >
          <span style={{backgroundColor: 'white', padding: 5}}>{tooltip.text}</span>
        </MouseTooltip>
    </div>
  )
}

export default Menu

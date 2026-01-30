import { useState, useEffect } from 'react'
import { useLoaderData } from 'react-router-dom'
import * as XLSX from 'xlsx'

import MouseTooltip from 'react-sticky-mouse-tooltip';

import Stack from "@mui/material/Stack";

import SmartInput from "./mui/SmartInput";
import Track from "./mui/Track";
import LeftMenu from './mui/LeftMenu.jsx'
import OpenDialog from './mui/OpenDialog.jsx';
import RightClickMenu from './mui/RightClickMenu.jsx';

import HistPlot from './plots/HistPlot.jsx';
import LinePlot from './plots/LinePlot'

import getFetch from '../Functions/getFetch.js'
import postFetch from '../Functions/postFetch.js';
import getRandomColor from '../Functions/getRandomColor.js'
import str2Numbers from '../Functions/str2numbers.js';

import DashboardIcon from '@mui/icons-material/Dashboard';
import Slider3 from './mui/Slider3.jsx';
import IndexField from './mui/IndexField.jsx';
import LaptopChromebookIcon from '@mui/icons-material/LaptopChromebook';
import SaveIcon from '@mui/icons-material/Save';
import IconButton from '@mui/material/IconButton';
import getBlob from '../Functions/getBlob.js';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeStandbyIcon from '@mui/icons-material/ModeStandby';
import RectangleIcon from '@mui/icons-material/Rectangle';
import BarChartIcon from '@mui/icons-material/BarChart';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import MultilineChartIcon from '@mui/icons-material/MultilineChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import GestureIcon from '@mui/icons-material/Gesture';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import LayersClearIcon from '@mui/icons-material/LayersClear';
import ImageIcon from '@mui/icons-material/Image';

import ScrollContainer from 'react-indiana-drag-scroll';

function Menu() {
  const { settings, colorsDict, serverUrl } = useLoaderData()
  const urlServer = serverUrl
  const [open, setOpen] = useState(false) // Открыто ли окно загрузки



  const [tooltip, setTooltip] = useState({visible: false, text: ''})

  const [spectrogram, setSpectogram] = useState(null)

  const [divRoi, setDivRoi] = useState({state: 0, list: [], current: 0})

  const [curRoi, setCurRoi] = useState(-1) // -1 это все изображение

  const [clickMode, setClickMode] = useState(0) // 0 - спектр, 1 - ROI, 2 - индекс расстояния

  const [rightMenuDisplay, setRightMenuDisplay] = useState({display: 'none', x: 0, y: 0, item: 'plots'})

  const [bands, setBands] = useState({text: '', story: settings.index_story, list: [], t: 1, condition: ''})

  const [hmap, setHmap] = useState({
    nameHsi: '',
    count_bands: 204,
    channels_expr: '0-203',
    nm: [],
    roi: {x0: 0, x1: 511, y0: 0, y1: 511},
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
    clusterIndx: {channel: null, thr: .99, method: 'cosine', metrics: 'cosine', centroids: [], medoids: [], mx_corr: {channel: null, mode: 'centroids'}},
    emd: {channel: null, number_of_modes: 8, windows_size: 3, n_band: 0, n_mode: 0},
    reley: {spectres: []},
    sigma: {spectres: [], value: 2},
    hiddenMask: true,
    leftClick: 'push',
    diff_flag: false,
    emd_flag: false,
    rgb_bands: [70, 52, 19]
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
  
  const [tirPoints, setTirPoints] = useState([])
  
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

    const addImageOptions = settings.index_story.map(el => ({group: 'Примеры индексов/каналов', label: el, value: el})).concat([
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
    // {
    //   group: 'Спектрограмма',
    //   label: 'Корреляция',
    //   value: 'matrix_correlation'
    // },

    {
      group: 'Кластеризация',
      label: 'KMeans ',
      value: 'kmeans'
    },
    {
      group: 'Кластеризация',
      label: 'MiniBatchKMeans ',
      value: 'mini_batch_kmeans'
    },
    {
      group: 'Кластеризация',
      label: 'Birch ',
      value: 'birch'
    },
    {
      group: 'Кластеризация',
      label: 'SpectralClustering| ',
      value: 'spectral_clustering'
    },
    {
      group: 'Кластеризация',
      label: 'AgglomerativeClustering| ',
      value: 'agglomerative_clustering'
    },
    {
      group: 'Кластеризация',
      label: 'GaussianMixture| ',
      value: 'gaussian_mixture'
    },
    {
      group: 'Кластеризация',
      label: 'AffinityPropagation|| ',
      value: 'affinity_propagation'
    },
    {
      group: 'Кластеризация',
      label: 'OPTICS|| ',
      value: 'optics'
    },
    
    {
      group: 'Кластеризация по порогу',
      label: 'Косинусная: ',
      value: 'cosine'
    },
    {
      group: 'Кластеризация по порогу',
      label: 'HDBSAN: ',
      value: 'hdbscan'
    },
    {
      group: 'Кластеризация по порогу',
      label: 'Иерархическая: ',
      value: 'sch'
    },
    {
      group: 'Кластеризация по порогу',
      label: 'Корреляция по центроидам',
      value: 'centroids'
    },
    {
      group: 'Кластеризация по порогу',
      label: 'Корреляция по медоидам',
      value: 'medoids'
    },

    {
      group: 'Индекс расстояния',
      label: 'SAM',
      value: 'sam'
    },
    {
      group: 'Индекс расстояния',
      label: 'SID',
      value: 'sid'
    },
    {
      group: 'Индекс расстояния',
      label: 'SCA',
      value: 'sca'
    },
    {
      group: 'Индекс расстояния',
      label: 'Chebychev',
      value: 'chebychev'
    },
    {
      group: 'Индекс расстояния',
      label: 'Adaptive Cosine/coherent Estimator',
      value: 'ace'
    },
    {
      group: 'Индекс расстояния',
      label: 'Constrained Energy Minimization',
      value: 'cem'
    },
    {
      group: 'Индекс расстояния',
      label: 'Mathed Filter',
      value: 'mf'
    },
    {
      group: 'Индекс расстояния',
      label: 'SCM',
      value: 'scm'
    },
    {
      group: 'Индекс расстояния',
      label: 'BC',
      value: 'bc'
    },
    {
      group: 'Индекс расстояния',
      label: 'JM',
      value: 'jm'
    },
    {
      group: 'Индекс расстояния',
      label: 'Mixed1',
      value: 'mix1'
    },
    {
      group: 'Индекс расстояния',
      label: 'Mixed2',
      value: 'mix2'
    },
    {
      group: 'Индекс расстояния',
      label: 'Mixed3',
      value: 'mix3'
    },
    {
      group: 'Индекс расстояния',
      label: 'Mixed4',
      value: 'mix4'
    },
    {
      group: 'Индекс расстояния',
      label: 'Mixed5',
      value: 'mix5'
    },
    {
      group: 'Индекс расстояния',
      label: 'Mixed6',
      value: 'mix6'
    },
    // {
    //   group: 'Индекс расстояния',
    //   label: 'Generalized Likelihood Ratio Test',
    //   value: 'glrt'
    // },
    // {
    //   group: 'Индекс расстояния',
    //   label: 'Orthogonal Subspace Projection',
    //   value: 'osp'
    // },
    
    {
      group: 'Поиск эталонов',
      label: 'PPI',
      value: 'ppi'
    },
    {
      group: 'Поиск эталонов',
      label: 'NFINDR',
      value: 'nfindr'
    },

    {
      group: 'Карты изобилия',
      label: 'FCLS',
      value: 'fcls'
    },
    {
      group: 'Карты изобилия',
      label: 'UCLS',
      value: 'ucls'
    },
    {
      group: 'Карты изобилия',
      label: 'NNLS',
      value: 'nnls'
    },

    {
      group: 'Синтез RGB',
      label: `RGB: ${hmap.rgb_bands[0]} ${hmap.rgb_bands[1]} ${hmap.rgb_bands[2]}`,
      value: 'synthesis'
    },

    {
      group: 'Многоканальный синтез',
      label: 'Производная HSI',
      value: 'diff'
    },
    {
      group: 'Многоканальный синтез',
      label: 'Empirical Mode Decomposition',
      value: 'emd'
    },
    {
      group: 'Многоканальный синтез',
      label: 'EMD(мода,канал): ',
      value: 'emd_n'
    },
  ])

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

  const autoRoi = async () => {

    // Удалить предыдущие ROI
    const delRois = document.getElementsByClassName('div-roi')
    // setDivRoi({...divRoi, list: []})
    // setCurRoi(-1) 
    Array.from(delRois).forEach(async delRoi => {
      delRoi.remove()
    })

    const result = await getFetch(urlServer, 'hsi_auto_slicer', {})
    // console.log(result)

    // await createFullRoi(...result[0])
    // await createFullRoi(...result[1])
    const lstRois = []
    result.forEach(async xy => {
      lstRois.push(await createFullRoi(...xy))
    })
    setDivRoi({state: 0, list: lstRois, current: lstRois.length})

    const rois = document.getElementsByClassName('div-roi')
    
    // for (let i = 0; i < rois.length; i+=1){
    //   rois[i].id = `roi-${i}`
    //   console.log(rois[i])
    // }

    Array.from(rois).forEach(async (el, i) => {
      rois[i].id = `roi-${i}`
      console.log(rois[i])
    })
    // setCurRoi(rois.length) 
    // setDivRoi({...divRoi, list: [...divRoi.list.map(el => el)]})
    console.log(divRoi)

  }

  const saveAllRoiAsXlsx = async () => {
    const xyRois = divRoi.list.map(el => el[0].text)
    await postFetch(urlServer, 'save_all_rois', {xy_rois: xyRois})

  }

  const getRgb = async (mode='rgb') => {
    const res = await getBlob(urlServer, mode, {})
    const img = new Image();
    img.src = URL.createObjectURL(res);
    console.log(img)
    
    img.onload = () => {
        setBands({...bands, list: [{type: 'rgb', img: img.src, label: `${hmap.nameHsi} | ${hmap.rows}x${hmap.cols}х${hmap.count_bands}`, width: img.width, height: img.height}]})
        document.getElementsByClassName('card')[0].setAttribute("style",`height: ${img.height}px`)
    };
  }

  useEffect(() => {
    if (hmap.nameHsi) getRgb()

    // Контекстное меню для графиков
    document.getElementsByClassName('histAndPlot')[0].addEventListener('contextmenu', e => {
      e.preventDefault()
      
      const x = e.clientX - document.getElementsByClassName('card')[0].getBoundingClientRect().left
      const y = e.clientY - document.getElementsByClassName('card')[0].getBoundingClientRect().top
      
      setRightMenuDisplay({display: 'block', x, y, item: 'plots'})
    })

    // Контекстное меню для фото
    document.getElementsByClassName('photo')[0].addEventListener('contextmenu', e => {
      e.preventDefault()
      
      const x = e.clientX - document.getElementsByClassName('card')[0].getBoundingClientRect().left
      const y = e.clientY - document.getElementsByClassName('card')[0].getBoundingClientRect().top
      
      setRightMenuDisplay({display: 'block', x, y, item: 'photo'})
    })

    // Закрытие контекстного меню
    document.getElementsByClassName('page')[0].addEventListener('click', e => {
      setRightMenuDisplay({...rightMenuDisplay, display: 'none'})
    })
    
  }, [hmap.nameHsi])

  useEffect(() => {
    if (bands.list.length > 1) getHist()
  }, [bands.list.length])

  useEffect(() => {
    Array.from(document.getElementsByClassName('div-roi')).map(el => el.style.display = `${!clickMode || clickMode === 2 || bands.list[0].type === 'spectrogram' ? 'none' : 'block'}`)
  }, [clickMode, bands.list])

  useEffect(() => {
    reloadSpectres();
  }, [sign.filter, tracker.filter.max_val]);

  const getRgbSyn = async () => {
    const fetch_arg = {red: rgbTrack.red, green: rgbTrack.green, blue: rgbTrack.blue}
    if (rgbTrack.blue_mode) fetch_arg.blue_mode = rgbTrack.blue_mode
    if (rgbTrack.green_mode) fetch_arg.green_mode = rgbTrack.green_mode
    if (rgbTrack.red_mode) fetch_arg.red_mode = rgbTrack.red_mode
    const result = await getFetch(urlServer, 'rgb_synthesize', fetch_arg)
    setRgbTrack({...rgbTrack, rgb: result.rgb, sliderCommit: false})
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
  }

  const fetchSpectre = async (x, y) => {
    return await getFetch(urlServer, 'signal', {x, y, method: sign.filter, h: tracker.filter.max_val})
  };

  const pushSpectre = async (e) => {
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

  const saveMx2Table = async () => {
    await getFetch(urlServer, 'save_band', {expr: bands.list[0].expr})
  }
  
  const getChannel = async (expression = undefined) => {
    const expr_conditional = (expression ? expression : bands.text)
    const expr_decomposition = expr_conditional.includes('<') ? expr_conditional.split('<') : expr_conditional.split('>')

    const expr = expr_decomposition[0]
    const t = expr_decomposition.length !== 1 ? parseFloat(expr_decomposition[1]) : bands.t
    const condition = expr_conditional.includes('<') ? 'lower' : (expr_conditional.includes('>') ? 'upper' : '')
    
    const res = await getBlob(urlServer, 'bands_png', {expr, t, condition})
    const img = new Image();
    img.src = URL.createObjectURL(res);
    
    img.onload = () => {
      setBands({...bands, list: [{img: img.src, type: 'band', label: `${expr} | t: ${t}` + (hmap.diff_flag ? ' | Производная' : ''), width: img.width, height: img.height, expr}, ...bands.list], t})
    }
    
    setHist({...hist, indx: {...hist.indx, ...info}})
  };

  const getHist = async () => {
    const {signal, diff, ...info} = await getFetch(urlServer, 'hist', {})

    setHist({...hist, indx: {...hist.indx, ...info}, mode: 'indx'})
    if (diff) setSign({...sign, spectres: [...sign.spectres.filter(el => el.x === -1 && el.y === -1), { signal, diff, x: -1, y: -1, color: getRandomColor(), label: (curRoi === -1 ? 'HSI ' : `ROI ${curRoi} `) + document.getElementById(':r5:').value }] })
  }

  const getStatMx = async (name=hmap.expression) => {
    const res = await getBlob(urlServer, 'idx_mx', {name})
    const img = new Image();
    img.src = URL.createObjectURL(res);
    
    const scale_factor =  hmap.rows / hmap.count_bands
    img.onload = () => {
      const expr = addImageOptions.filter(option => option.value === name)[0].label
      setBands({...bands, list: [{type: 'spectrogram', img: img.src, label: `${expr} | по ${curRoi === -1 ? 'HSI' : `ROI №${curRoi}`} | t: ${bands.t}` + (hmap.diff_flag ? ' | Производная' : ''), width: hmap.rows, height: hmap.rows, expr: name}, ...bands.list]})
      setSpectogram({img: img.src, width: img.width, height: img.height, scale: scale_factor})
    }
  }

  const getSpectreClass = async e => {
    const x = Math.round(e.clientX - document.getElementById('photo-0-img').getBoundingClientRect().left)
    const y = Math.round(e.clientY - document.getElementById('photo-0-img').getBoundingClientRect().top)

    const methodLabel = document.getElementById(':r1:').value
    const method = addImageOptions.filter(el => el.label === (methodLabel ? methodLabel : 'SAM'))[0].value
    
    const res = await getBlob(urlServer, 'classes', {method, x, y})
    const img = new Image();
    img.src = URL.createObjectURL(res);
    console.log(img)
    img.onload = () => {
      setBands({...bands, list: [{img: img.src, type: 'band', label: `${methodLabel} | x: ${x}, y: ${y}` + (hmap.diff_flag ? ' | Производная' : ''), width: img.width, height: img.height, expr: methodLabel}, ...bands.list]})
    }
    
    // Добавить соответствующий спектр
    const signData = await fetchSpectre(x, y);
    setSign({...sign, spectres: [{ ...signData, x, y, color: getRandomColor() }] });
  }

  const startReley = async (e) => {
    const {reley} = await getFetch(urlServer, 'reley', {})
    setHmap({...hmap, reley: {...hmap.reley, spectres: reley.map(el => ({...el, x: -1, y: -1, color: getRandomColor()}))}})
  }

  const startSigma = async (e) => {
    if (e.key === 'Enter') {
      const {sigma} = await getFetch(urlServer, 'sigma', {sigma: e.target.value})
      setHmap({...hmap, sigma: {...hmap.sigma, spectres: sigma.map(el => ({...el, x: -1, y: -1, color: getRandomColor()}))}})
    }
  }

  const startClusterCorr = async (mode='centroids') => {
    const result = await getFetch(urlServer, 'clusters_corr', {mode})
    setHmap({...hmap, clusterIndx: {...hmap.clusterIndx, mx_corr: {...hmap.clusterIndx.mx_corr, channel: result.segmentation, mode: result.mode, hist: result.hist, bins: result.bins}}})
    setHist({...hist, indx: {...hist.indx, hist: result.hist, bins: result.bins}})
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
      channels_expr: `0-${fileinfo.count_bands-1}`,
      rgb_bands: fileinfo.rgb_bands
    })
    setSign({ ...sign, endBand: fileinfo.count_bands-1})
  }

  const openChannel = async e => {
    const res = await getBlob(urlServer, 'tir', {})
    console.log(res)
    const img = new Image();
    img.src = URL.createObjectURL(res);
    
    img.onload = () => {
      setBands({...bands, list: [{img: img.src, type: 'band_special', label: `Канал | `, width: img.width, height: img.height}, ...bands.list]})
    }
    
    setHist({...hist, indx: {...hist.indx, ...info}})
  }

  const drawPoint = async e => {
    const x = Math.round(e.clientX - document.getElementById('photo-0-img').getBoundingClientRect().left)
    const y = Math.round(e.clientY - document.getElementById('photo-0-img').getBoundingClientRect().top)
    const res = await getBlob(urlServer, 'draw_point', {x, y})
    console.log(res)
    const img = new Image();
    img.src = URL.createObjectURL(res);
    
    img.onload = () => {
      setBands({...bands, list: [{img: img.src, type: 'band_special', label: bands.list.filter((el, i) => i === 0)[0].label + `(${x},${y}), `, width: img.width, height: img.height}, ...bands.list.filter((el, i) => i !== 0)]})
    }
    
    setTirPoints([...tirPoints, x, y])
  }

  const getHomography = async () => {
    const hsiPoints = sign.spectres.map(el => [el.x, el.y]).flat()
    const res = await getBlob(serverUrl, 'homography', {tirPoints, hsiPoints})
    const img = new Image();
    img.src = URL.createObjectURL(res);

    img.onload = () => {
      setBands({...bands, list: [{img: img.src, type: 'band_special', label: 'Совмещенное изображение', width: img.width, height: img.height}, ...bands.list]})
    }
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
      title: 'Открыть индекс',
      type: 'button',
      icon: <LaptopChromebookIcon />,
      click: e => openChannel('3.xlsx'),
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

  const histogramComponent = (parameters={}) => {
  const {w=hist.width, h=hist.height, hist_band=hist[hist.mode].hist, bins_band=hist[hist.mode].bins, spectres=sign.spectres, xlabel=''} = parameters
  return <HistPlot xlabel={xlabel}
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

  const createFullRoi = async (x0, y0, x, y) => {
    const div = document.createElement('div')
    div.id = `roi-${divRoi.list.length}`
    div.className = 'div-roi'

    const card = document.getElementsByClassName('indiana-scroll-container--hide-scrollbars')[0]
    // console.log(div)
    // console.log(card)
    divRoi.currentColor = getRandomColor()
    div.style.border = `${divRoi.currentColor} 3px solid`
    div.style.backgroundColor = '#00ffff47'
    div.style.position = 'absolute'
    div.style.marginLeft = `${x0}px`
    div.style.marginTop = `${y0}px`
    div.style.height = '0px'
    div.style.width = '0px'
    card.append(div)

    // const x = getXEvent(e)
    // const y = getYEvent(e)

    const id = divRoi.list.length
    // const div = document.getElementById(`roi-${id}`)
    // const x0 = parseInt(div.style.marginLeft)
    // const y0 = parseInt(div.style.marginTop)

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
    const lst = [...divRoi.list, {x0, y0, x1: x - 5, y1: y - 5, color: divRoi.currentColor, text, changeRoiFunc}]
    // setDivRoi({state: 0, list: [...divRoi.list, {x0, y0, x1: x - 5, y1: y - 5, color: divRoi.currentColor, text, changeRoiFunc}], current: divRoi.current + 1})
    // setCurRoi(id)

    div.addEventListener('mousemove', e => setTooltip({...tooltip, visible: true, text: `ROI №${id} ` + text}))
    div.addEventListener('click', async e => {setCurRoi(id); await changeRoiFunc()})

    // await changeRoiFunc()
    return lst
  }

  const tooltipTextMx = e => {
    const x = Math.round((e.clientX - document.getElementById('photo-0-img').getBoundingClientRect().left) / spectrogram.scale)
    const y = Math.round((e.clientY - document.getElementById('photo-0-img').getBoundingClientRect().top) / spectrogram.scale)
    const nmX = hmap.nm[x]
    const nmY = hmap.nm[y]
    return `x: ${x}, y: ${y}, nm(x): ${nmX}, nm(y): ${nmY}`
  }

  const addImagePressButton = async e => {
    const addImageOptionsElement = addImageOptions.filter(option => e.target.value.startsWith(option.label))[0]

    if (!addImageOptionsElement || addImageOptionsElement.group === 'Синтез RGB') {
      if (e.target.value.startsWith('RGB: ')) {
        const [_, red, green, blue] = e.target.value.split(' ')
        const res = await getBlob(urlServer, 'rgb_synthesize', {red, green, blue})
        const img = new Image()
        img.src = URL.createObjectURL(res)

        img.onload = () => {
          setBands({...bands, list: [{img: img.src, type: 'band', label: `Синтез RGB: ${red} | ${green} | ${blue}`, width: img.width, height: img.height}, ...bands.list]})
        }
      }
      else {
        getChannel(e.target.value)
      }
      return
    }

    const {group, label, value} = addImageOptionsElement

    if (group === 'Спектрограмма') getStatMx(value)
    else if (group === 'Индекс расстояния') setClickMode(2)
    else if (group === 'Примеры индексов/каналов') getChannel(e.target.value)
    else if (group === 'Кластеризация') {
      const k = Number(e.target.value.split(' ')[1])
  
      const res = await getBlob(urlServer, 'clusters', {k, method: value})
      const img = new Image()
      img.src = URL.createObjectURL(res)

      img.onload = () => {
        setBands({...bands, list: [{img: img.src, type: 'band', label: `Метод: ${value} | k = ${k}` + (hmap.diff_flag ? ' | Производная' : ''), width: img.width, height: img.height}, ...bands.list]})
      }
    }
    else if (group === 'Кластеризация по порогу') {
      if (value === 'centroids' || value === 'medoids') {
        const res = await getBlob(urlServer, 'clusters_corr', {mode: value})
        const img = new Image();
        img.src = URL.createObjectURL(res);
        
        const scale_factor =  hmap.rows / hmap.count_bands
        img.onload = () => {
          setBands({...bands, list: [{type: 'spectrogram', img: img.src, label: `Кластеризация по ${value} | по ${curRoi === -1 ? 'HSI' : `ROI №${curRoi}`} | t: ${bands.t}` + (hmap.diff_flag ? ' | Производная' : ''), width: hmap.rows, height: hmap.rows, expr: value}, ...bands.list]})
          setSpectogram({img: img.src, width: img.width, height: img.height, scale: scale_factor})
        }
        return
      }
      
      const thr = Number(e.target.value.split(' ')[1])
      const res = await getBlob(urlServer, 'clusters_thr', {thr, method: value, metrics: 'cosine'})
      const img = new Image()
      img.src = URL.createObjectURL(res)

      img.onload = () => {
        setBands({...bands, list: [{img: img.src, type: 'band', label: `Метод: ${value} | thr = ${thr}` + (hmap.diff_flag ? ' | Производная' : ''), width: img.width, height: img.height}, ...bands.list]})
      }
    }
    else if (group === 'Поиск эталонов') {
    const k = Number(e.target.value.split(' ')[1])
    const {endmembers} = await getFetch(urlServer, 'endmembers', {k, method: value})

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
    }
    else if (group === 'Карты изобилия') {
      const endmembers = sign.spectres.map(el => [el.x, el.y]).flat()
      const res = await getBlob(urlServer, 'amaps', {method: value, endmembers})
      const img = new Image();
      img.src = URL.createObjectURL(res);

      const bands_list = await Promise.all(
        sign.spectres.map(async (el, i) => {
          const res = await getBlob(urlServer, 'amaps_n', {number: i})
          const img = new Image();
          img.src = URL.createObjectURL(res);

          return {img: img.src, type: 'band', label: `Метод: ${label} | №${i}` + (hmap.diff_flag ? ' | Производная' : ''), width: hmap.cols, height: hmap.rows}
        })
      )

      console.log(bands_list)
      setBands({...bands, list: [...bands_list, ...bands.list]})
    }
    else if (group === 'Многоканальный синтез') {
      if (label === 'Производная HSI') {
        await getFetch(serverUrl, 'change_order', {diff: !hmap.diff_flag})
        setHmap({...hmap, diff_flag: !hmap.diff_flag})
      }
      else if (label === 'Empirical Mode Decomposition') {
        const res = await getFetch(urlServer, 'emd', {})
        if (res.emd_flag) setHmap({...hmap, emd_flag: true})
      }
      else if (label === 'EMD(мода,канал): ') {
        const [_, n_mode, n_band] = e.target.value.split(' ')
        const res = await getBlob(urlServer, 'emd_channel', {n_mode, n_band})
        const img = new Image();
        img.src = URL.createObjectURL(res);

        img.onload = () => {
          setBands({...bands, list: [{img: img.src, type: 'band', label: `EMD: канал ${n_band} | мода ${n_mode}`, width: img.width, height: img.height}, ...bands.list]})
        }
      }
    }
  }
  
  const saveImageAs = () => {
    let img = document.getElementById('photo-0-img')

    // создаём <canvas> того же размера
    let canvas = document.createElement('canvas');
    canvas.width = img.clientWidth;
    canvas.height = img.clientHeight;

    let context = canvas.getContext('2d');

    // копируем изображение в  canvas (метод позволяет вырезать часть изображения)
    context.drawImage(img, 0, 0);

    canvas.toBlob(function(blob) {
      // после того, как Blob создан, загружаем его
      let link = document.createElement('a');
      link.download = 'index.png';

      link.href = URL.createObjectURL(blob);
      link.click();

      // удаляем внутреннюю ссылку на Blob, что позволит браузеру очистить память
      URL.revokeObjectURL(link.href);
    }, 'image/png');
  }

  const rightMenuButtonItems = [
    {
      text: 'Гистограмма индекса',
      icon: <BarChartIcon/>,
      divider: false,
      onClick: e => setHist({...hist, mode: 'indx'})
    },
    {
      text: 'Статистика индекса',
      icon: <InsertChartIcon/>,
      divider: false,
      onClick: e => setHist({...hist, mode: 'indx_info'})
    },
    {
      text: 'Статистика спектров',
      icon: <StackedBarChartIcon/>,
      divider: true,
      onClick: e => setHist({...hist, mode: 'sign'})
    },

    {
      text: 'Производная спектров',
      icon: <MultilineChartIcon/>,
      divider: false,
      onClick: e => setSign({...sign, type: sign.type === 'signal' ? 'diff' : 'signal'})
    },
    {
      text: 'Сохранить спектры',
      icon: <SaveIcon/>,
      divider: true,
      onClick: saveSpectre2Xlsx
    },

    {
      text: 'Нет сглаживания',
      icon: <TimelineIcon/>,
      divider: false,
      onClick: (e) => setSign({ ...sign, filter: '' })
    },
    {
      text: 'Сглаживание Савицкого - Голея',
      icon: <AutoGraphIcon/>,
      divider: false,
      onClick: (e) => setSign({ ...sign, filter: 'golay' })
    },
    {
      text: 'Сглаживание Надарая - Ватсона',
      icon: <GestureIcon/>,
      divider: false,
      onClick: (e) => setSign({ ...sign, filter: 'nadarai' })
    },
  ]

  const rightMenuButtonItemsPhoto = [
    {
      text: 'Режим клика: сигнатура',
      icon: <ModeStandbyIcon/>,
      divider: false,
      onClick: e => setClickMode(0)
    },
    {
      text: 'Режим клика: ROI',
      icon: <RectangleIcon/>,
      divider: false,
      onClick: e => setClickMode(1)
    },
    {
      text: 'Режим клика: индекс расстояния',
      icon: <AltRouteIcon/>,
      divider: true,
      onClick: e => setClickMode(2)
    },

    {
      text: 'Очистить изображения',
      icon: <LayersClearIcon/>,
      divider: false,
      onClick: e => setBands({...bands, list: [...bands.list.filter(el => el.type === 'rgb')]})
    },
    {
      text: 'Удалить ROI',
      icon: <DeleteIcon/>,
      divider: true,
      onClick: async e => {delRoi(e); await getFetch(serverUrl, 'change_roi', {x0: 0, x1: hmap.cols, y0: 0, y1: hmap.rows})}
    },
    
    {
      text: 'Сохранить изображение',
      icon: <ImageIcon/>,
      divider: false,
      onClick: saveImageAs
    },
    {
      text: 'Сохранить изображение в .xlsx',
      icon: <SaveIcon/>,
      divider: true,
      onClick: saveMx2Table
    },

    {
      text: 'Найти производную ГСИ',
      icon: <MultilineChartIcon/>,
      divider: true,
      onClick: async e => {await getFetch(serverUrl, 'change_order', {diff: !hmap.diff_flag}); setHmap({...hmap, diff_flag: !hmap.diff_flag})}
    },
    {
      text: 'Совместить изображения',
      icon: <MultilineChartIcon/>,
      divider: true,
      onClick: getHomography
    },
    {
      text: 'Найти ROI автоматически',
      icon: <MultilineChartIcon/>,
      divider: false,
      onClick: async e => { autoRoi()} //getRgb('hsi_auto_slicer')
    },
    
    {
      text: 'Сохранить все ROI',
      icon: <MultilineChartIcon/>,
      divider: false,
      onClick: async e => { saveAllRoiAsXlsx()} 
    },
  ]

  const clickImageFunction = async (e, el, i) => {
    if (i === 0 && el.type === 'band_special') {
      await drawPoint(e)
      return
    }
    if (i === 0 && el.type !== 'spectrogram') { // Работаем только на 1 (левом) изображении
      if (clickMode === 0) { // Вычислить сигнатуру
        await pushSpectre(e)
      }
      else if (clickMode === 1) { // Нарисовать ROI
        !divRoi.state ? createRoi(e) : saveRoi(e)
      }
      else if (clickMode === 2) { // Индекс растояния
        await getSpectreClass(e)
      }
    }
    else { // Иначе перемещаем изображение
      setBands({...bands, list: [bands.list[i], ...bands.list.filter((val, indx) => indx !== i)]})
    }         
  }
  
  return (
    <div className="page">
      <RightClickMenu display={rightMenuDisplay.item === 'plots' ? rightMenuDisplay.display : 'none'} x={rightMenuDisplay.x} y={rightMenuDisplay.y} buttonItems={rightMenuButtonItems}/>
      <RightClickMenu display={rightMenuDisplay.item === 'photo' ? rightMenuDisplay.display : 'none'} x={rightMenuDisplay.x} y={rightMenuDisplay.y} buttonItems={rightMenuButtonItemsPhoto}/>

      <Stack>
        <IndexField 
          menuComponent={<LeftMenu navigation={navigation}/>} 
          defaultValue={bands.text}
          pressEnter={async e => e.key == "Enter" && addImagePressButton(e)}
          // story={bands.story}
          options={addImageOptions}
          buttonClear={e => setBands({...bands, list: [...bands.list.filter(el => el.type === 'rgb')]})}
          button3d={e => setHmap({...hmap, type: hmap.type === 'heatmap' ? 'surface' : 'heatmap'})}
          backgButton={e => setHmap({...hmap, hiddenMask: !hmap.hiddenMask})}
          // component1={<RenderGroup options={addImageOptions} pressEnter={e => e.key == "Enter" && addImagePressButton(e)}/>}
          component2={<SmartInput
            width={350}
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
          // component5={<SaveMenu saveButtons={[
          //         {
          //             title: 'Сохранить спектры',
          //             onClick: saveSpectre2Xlsx
          //         },
          //         {
          //             title: 'Сохранить изображение',
          //             onClick: saveMx2Table
          //         },
          //     ]}/>
          // }
          buttonClickMode={<IconButton color="primary" sx={{ p: '10px' }} aria-label="directions" onClick={e => setClickMode(!clickMode ? 1 : 0)}>
            {!clickMode ? <ModeStandbyIcon /> : (clickMode === 1 ? <RectangleIcon/> : <AltRouteIcon/>)}
          </IconButton>}
          textTip={hmap.emd_flag ? 'EMD вычислено' : ''}
          label={hmap.diff_flag? 'HSI индекс производной' : 'HSI индекс'}
          colorLabel={hmap.diff_flag? 'rgba(228, 69, 130, 1)' : "#1E90FF"}
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
                  onClick={e => clickImageFunction(e, el, i)}
                  onMouseMove={e => i === 0 && (divRoi.state == 1 ? resizeRoi(e) : setTooltip({...tooltip, visible: true, text: el.type !== 'spectrogram' ? `x: ${getXEvent(e)}, y: ${getYEvent(e)}` : tooltipTextMx(e)}))}
                  onMouseLeave={e => i === 0 && tooltip.visible && setTooltip({...tooltip, visible: false, text: ''})}
                  />
                  <br/>
                  <div className='label-container'>
                    <label className='label-item'>{el.label}</label>
                  </div>
              </div>))}
            </ScrollContainer>
          </div>

      </Stack>

        <Stack direction="row" spacing={2} >
          <div className='histAndPlot'>
            {sign.spectres.length !== 0 && linePlotComponent({w: 1000, h: 450})}
            {hist[hist.mode].bins && histogramComponent({w:1000, h:450, xlabel: {indx: 'Гистограмма индекса', sign: 'Статистика спектров', indx_info: 'Статистика индекса'}[hist.mode]})}
          </div>
        </Stack>

        <Stack direction="row" spacing={2}>
          <SmartInput
            pressChannel={setSmartSpectre}
            title={'Cпектральная сигнатура' + (sign.filter === 'golay' ? ' (сглаживание Савицкого - Голея)' : (sign.filter === 'nadarai' ? ' (сглаживания Надарая - Ватсона)' : ''))}
            value={sign.spectres.map((item) => item.x !== -1 && item.y !== -1 ? `${item.x},${item.y}` : item.label).join(" | ")}
            width={900}
            />
          
          {trackComponent('filter')}
        </Stack>

      {/* <Stack direction="row" spacing={2}>
        <ContentTabs value={tab} setValue={setTab} buttonsFunc={[undefined, e => saveMx2Table(), undefined, e => openTir('3.xlsx')]} content_obj={{
          ['Поиск эталонов']: <>
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
          </>,
          
          ['EMD']: <>
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
          </>,
          ['Синтез RGB']: <>
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
            {rgbTrack.rgb && <Rgb rgb={rgbTrack.rgb} />}
          </Stack>
        </>,
          ['Кластеризация']: <>
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
          </>,
          
          ['Матрица кросс-корреляции']: <>
          <Button onClick={e => startClusterCorr('centroids')}>Центроиды</Button>
          <Button onClick={e => startClusterCorr('medoids')}>Медоиды</Button>
            
            {hmap.clusterIndx.centroids && linePlotComponent({h: 300, w: 800, data: hmap.clusterIndx[hmap.clusterIndx.mx_corr.mode]})}

          </>,
          ['Релеевское рассеяние']: <>
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
        }}/>

      </Stack> */}
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

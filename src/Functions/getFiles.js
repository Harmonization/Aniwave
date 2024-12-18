
const token = import.meta.env.VITE_DISK_TOKEN
const disk_url = import.meta.env.VITE_DISK_URL
const disk_section = import.meta.env.VITE_DISK_SECTION
const main_root = import.meta.env.VITE_DISK_FOLDER

import getUrl from '../Functions/getUrl.js'
import getFetch from '../Functions/getFetch.js'

export const getFiles = async () => {
    // Показать файлы с диска

    // const {_embedded: {items}} = await getFetch(`${disk_url}`, `${disk_section}`, {fields: 'name,_embedded.items.path'}, {headers: {Authorization: `OAuth ${token}`}})

    const request = `${disk_url}${disk_section}?path=${main_root}&fields=name,_embedded.items.path`
    const response = await fetch(request, {headers: {Authorization: `OAuth ${token}`}})
    const {_embedded: {items}} = await response.json()
    
    const paths = items.filter(({path}) => path.includes('.npy'))
    const files = paths.map(({path}) => path.split('/').slice(-1)[0])

    // Загрузка длин волн
    const nm = [
        397,
        400,
        403,
        406,
        409,
        412,
        415,
        418,
        420,
        423,
        426,
        429,
        432,
        435,
        438,
        441,
        444,
        446,
        449,
        452,
        455,
        458,
        461,
        464,
        467,
        470,
        473,
        476,
        478,
        481,
        484,
        487,
        490,
        493,
        496,
        499,
        502,
        505,
        508,
        510,
        513,
        516,
        519,
        522,
        525,
        528,
        531,
        534,
        537,
        540,
        543,
        546,
        549,
        551,
        554,
        557,
        560,
        563,
        566,
        569,
        572,
        575,
        578,
        581,
        584,
        587,
        590,
        593,
        596,
        599,
        602,
        605,
        607,
        610,
        613,
        616,
        619,
        622,
        625,
        628,
        631,
        634,
        637,
        640,
        643,
        646,
        649,
        652,
        655,
        658,
        661,
        664,
        667,
        670,
        673,
        676,
        679,
        682,
        685,
        688,
        691,
        694,
        697,
        700,
        703,
        706,
        709,
        712,
        715,
        718,
        721,
        724,
        727,
        730,
        733,
        736,
        739,
        742,
        745,
        748,
        751,
        754,
        757,
        760,
        763,
        766,
        769,
        772,
        775,
        778,
        781,
        784,
        787,
        790,
        793,
        796,
        799,
        802,
        805,
        808,
        811,
        814,
        817,
        820,
        823,
        826,
        829,
        832,
        835,
        838,
        841,
        844,
        847,
        850,
        853,
        856,
        859,
        862,
        866,
        869,
        872,
        875,
        878,
        881,
        884,
        887,
        890,
        893,
        896,
        899,
        902,
        905,
        908,
        911,
        914,
        917,
        920,
        924,
        927,
        930,
        933,
        936,
        939,
        942,
        945,
        948,
        951,
        954,
        957,
        960,
        963,
        967,
        970,
        973,
        976,
        979,
        982,
        985,
        988,
        991,
        994,
        997,
        1000,
        1004
    ]

    // Загрузка текста описания разделов
    const text = [
        {
            "Предобработка": "Здесь будет текст предобработки."
        },
        {
            "Визуализация": "Просмотр каналов и индексов HSI через 'умную строку'. Гистограмма отображает статистику полученного изображения. При клике на любой пиксель можно посмотреть его спектральную сигнатуру и производную, для них также находится статистика.",
            "Статистика": "Данный раздел предназначен для поиска статистических величин, извлекаемых из всего кубика HSI. Корреляция (Пирсона) вычисляется между каждой парой каналов, а полученные значения складываются в таблицу (матрица корреляции) и отображаются в виде тепловой карты. Каждый пиксель данной матрицы содержит значение корреляции между какой-либо парой каналов. При клике на любой пиксель строится модель линейной регрессии - строится график зависимости точек одного канала от другого, которые аппроксимируются прямой 'y = ax + b'. Чем выше коэффициент корреляции по модулю, тем лучше прямая иллюстрирует функциональную зависимость (т.е лучше совпадает с точками). Для данного рода зависимости также находятся следующие стат. величины: коэффициент детерминации, средняя эластичность и бета-коэффициент. Также можно получить статистику как для всего HSI, так и для каждого из каналов в отдельности - в последнем случае она представляется в виде графика. Например если выбрать 'Максимум по каналам', то по каждому каналу HSI будет вычислено максимальное значение (204 значения всего), и мы получим график зависимости максимума от канала."
        },
        {
            "Термальные изображения": "Здесь будет что-то про TIR и флуоресценцию"
        },
        {
            "Спектральная классификация": "Данный раздел включает в себя классические методы классификации спектров, такие как Spectral Angle Mapper (SAM), Spectral Information Divergence (SID) и Spectral Correlation Angle (SCA). Данные методы используются для нахождения спектров, наиболее похожих на заданный. Для каждого спектра, который мы принимаем за класс, HSI преобразуется в спектральный индекс, каждый пиксель которого измеряет его схожесть с классом. После этого, обычно, наиболее схожие пиксели отделяют по порогу, и говорят, что они и исходный спектр одного класса, однако в данном разделе вычисляется только спектральный индекс, поскольку он может быть наиболее полезен.",
            "Использование": "При нажатии на любой пиксель изображения, он выбирается в качестве класса, после чего применяется выбранный метод классификации, и отображается спектральная карта схожести. Для SAM и SID чем меньше значение в пикселе, тем выше схожесть; для SCA - наоборот (т.к вычисляется корреляция между спектрами).",
            "Кластеризация": "HSI можно разделить на классы автоматическим образом с помощью стандартных инструментов машинного обучения. Выбрав метод и количество классов (N), которые необходимо найти автоматически, каждый пиксель HSI будет пронумерован одним из N классов, после чего результат отобразится в виде тепловой карты."
        },
        {
            "Извлечение чистых спектров": "Существуют спектральные алгоритмы, которые позволяют автоматически находить классы в HSI, некоторые из них реализованы в данном разделе. Одна группа алгоритмов отвечает за выбор спектров, которые и будут являться классами, а вторая группа - за преобразование HSI в набор спектральных индексов (карты изобилия), показывающих содержание каждого из найденных классов в каждом пикселе (спектре) HSI. Чтобы воспользоваться данным функционалом, необходимо выбрать алгоритм из каждой группы и ввести количество искомых классов."
        },
        {
            "Пусто": "Пока ничего."
        }
    ]

    // Раскраски
    const colors = [
    'Earth',
    'Blackbody',
    'Bluered',
    'Blues',
    'Cividis',
    'Electric',
    'Greens',
    'Greys',
    'Hot',
    'Jet',
    'Picnic',
    'Portland',
    'Rainbow',
    'RdBu',
    'Reds',
    'Viridis',
    'YlGnBu',
    'YlOrRd'
    ]
    
    const colorsDict = Object.assign({}, ...Object.entries({...colors}).map(([a,b]) => ({ [b]: b })))

    // Выбранный сервер
    const serverUrl = await getUrl()
    console.log(serverUrl)

    // Загрузка настроек
    // const settings = await getFetch(serverUrl, 'settings')

    const settings = {
        "channel": "(nm757 - nm607) / (nm757 + nm607)",
        "index_story": [
            "(b120 - b70) / (b120 + b70)",
            "nm397",
            "(b120 - b70)",
            "(b120 - b70) / (b120 + b70) + 1",
            "nm406 - b10 / nm1004",
            " b10 / b0",
            "b70",
            "b120",
            "b150 + sin(b140)",
            "b30 * b60",
            "b203",
            "b203+2",
            "b100 - b40",
            "b203+1"
        ],
        "rois_story": [
            "x0=120, x1=180, y0=10, y1=150",
            "x0=10, x1=50, y0=10, y1=50",
            "x0=250, x1=350, y0=400, y1=450",
            "x0=30, x1=60, y0=30, y1=60",
            "x0=100, x1=150, y0=100, y1=179",
            "x0=100, x1=150, y0=99, y1=150",
            "x0=100, x1=150, y0=99, y1=159",
            "x0=333, x1=400, y0=250, y1=320",
            "x0=225, x1=300, y0=280, y1=345",
            "x0=120, x1=180, y0=10, y1=150",
            "x0=10, x1=50, y0=10, y1=50",
            "x0=250, x1=350, y0=400, y1=450",
            "x0=30, x1=60, y0=30, y1=60",
            "x0=100, x1=150, y0=100, y1=179",
            "x0=100, x1=150, y0=99, y1=150",
            "x0=100, x1=150, y0=99, y1=159",
            "x0=333, x1=400, y0=250, y1=320",
            "x0=225, x1=300, y0=280, y1=345",
            "x0=120, x1=180, y0=10, y1=150",
            "x0=10, x1=50, y0=10, y1=50",
            "x0=250, x1=350, y0=400, y1=450",
            "x0=30, x1=60, y0=30, y1=60",
            "x0=100, x1=150, y0=100, y1=179",
            "x0=100, x1=150, y0=99, y1=150",
            "x0=100, x1=150, y0=99, y1=159",
            "x0=333, x1=400, y0=250, y1=320",
            "x0=225, x1=300, y0=280, y1=345",
            "x0=100, x1=150, y0=99, y1=159",
            "x0=333, x1=400, y0=250, y1=320",
            "x0=225, x1=300, y0=280, y1=345"
        ],
        "colormap": "Rainbow",
        "filter": "golay",
        "h": 5,
        "t1": -0.46,
        "t2": 0.75
    }

    // Какие файлы уже есть на сервере
    const { downloadedFiles } = await getFetch(serverUrl, 'files')

    const diskFiles = files.filter(file => downloadedFiles.indexOf(file) === -1)

    return {paths, files, nm, text, settings, colorsDict, serverUrl, downloadedFiles, diskFiles}
}
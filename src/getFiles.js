
const token = import.meta.env.VITE_DISK_TOKEN
const body = import.meta.env.VITE_DISK_URL
const main_root = import.meta.env.VITE_DISK_FOLDER

export const getFiles = async () => {
    // Показать файлы с диска
    const request = `${body}?path=${main_root}&fields=name,_embedded.items.path`
    const response = await fetch(request, {headers: {Authorization: `OAuth ${token}`}})
    const {_embedded: {items}} = await response.json()
    
    const paths = items.filter(({path}) => path.includes('.npy'))
    const files = paths.map(({path}) => path.split('/').slice(-1)[0])

    // Загрузка длин волн
    const response_nm = await fetch('./static/nm.json')
    const nm = await response_nm.json()

    // Загрузка текста описания разделов
    const response_text = await fetch('./static/text.json')
    const text = await response_text.json()

    console.log(paths)
    return {paths, files, nm, text}
}
const token = import.meta.env.VITE_DISK_TOKEN
const disk_url = import.meta.env.VITE_DISK_URL
const disk_section = import.meta.env.VITE_DISK_SECTION
const main_root = import.meta.env.VITE_DISK_FOLDER

export default async function getDisk(folder) {
    const request = `${disk_url}${disk_section}?path=${folder ? main_root + '/' + folder : main_root}&fields=name,_embedded.items.path`
    const response = await fetch(request, {headers: {Authorization: `OAuth ${token}`}})
    const {_embedded: {items}} = await response.json()
    return items
}
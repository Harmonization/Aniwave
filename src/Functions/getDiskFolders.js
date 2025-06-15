
import getDisk from '../Functions/getDisk.js'

export default async function getDiskFolders() {
    const items = await getDisk()
    const folders_path = items.filter(({path}) => !path.includes('.'))
    const diskFolders = folders_path.map(({path}) => path.split('/').slice(-1)[0])
    return diskFolders
}
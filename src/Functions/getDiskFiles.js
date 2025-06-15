import getDisk from '../Functions/getDisk.js'

export default async function getDiskFiles(root) {
    const items = await getDisk(root)
    const paths = items.filter(({path}) => (path.includes('.hdr') || path.includes('.npy') || path.includes('.tif')) && !path.includes('nm.npy'))
    const files = paths.map(({path}) => path.split('/').slice(-1)[0])
    return files
}
export default function str2Numbers(name) {
    const [x0, x1, y0, y1] = name.split(',').map(num_str => Number(num_str.split('=')[1]))
    return [x0, x1, y0, y1]
}
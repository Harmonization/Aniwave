export default function str2Numbers(name) {
    // const [x0, x1, y0, y1] = name.split(',').map(num_str => Number(num_str.split('=')[1]))

    const [[x0, x1], [y0, y1]] = name.split(',').map(coord => coord.split(':')[1].split('-').map(num_str => Number(num_str)))

    return [x0, x1, y0, y1]
}
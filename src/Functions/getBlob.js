
export default async function getBlob(url, section, params, headers) {
    let request = `${url}${section}`
    if (params) request += '?' + new URLSearchParams(params)
    let response = await fetch(request, headers)
    const blob = await response.blob()
    return blob
}
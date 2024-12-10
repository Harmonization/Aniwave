
export default async function getFetch(url, section, params, headers) {
    let request = `${url}${section}`
    if (params) request += '?' + new URLSearchParams(params)
    let response = await fetch(request, headers)
    const json = await response.json()
    return json
}
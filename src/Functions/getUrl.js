
export default async function getUrl() {
    let serverUrl
    try {
        const request = `${import.meta.env.VITE_URL_DEV}`
        const response = await fetch(request)
        serverUrl = `${import.meta.env.VITE_URL_DEV}`
    } catch {
        serverUrl = `${import.meta.env.VITE_URL_DEPLOY}`
    }
    return serverUrl
}
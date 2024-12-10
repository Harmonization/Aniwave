
export default async function postFetch(url, section, data) {
    const request = `${url}${section}?`;
    const response = await fetch(request, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log(result);
}
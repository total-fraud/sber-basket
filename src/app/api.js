export async function getProducts() {
    const results = await fetch("https://62eb69e2ad295463259d5d99.mockapi.io/api/v1/goods")
    return results.json()
}

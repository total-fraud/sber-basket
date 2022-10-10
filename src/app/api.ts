export interface Product {
    createdAt: string,
    price: number,
    Name: string,
    quantity: number,
    id: string
}

export enum ProductType {
    StoreWillBuy = "storeWillBuy",
    ClientWillBuy = "clientWillBuy",
    DepositClosed = "depositClosed"

}

export async function getProducts(): Promise<Product[]> {
    const results = await fetch("https://62eb69e2ad295463259d5d99.mockapi.io/api/v1/goods")
    return results.json()
}
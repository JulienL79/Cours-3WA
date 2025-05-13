export const addPriceTTC = (products, vatRate) => {
    const productsCompleted = products.map(product => {
        const vat = Math.round(product.priceHT * vatRate)
        return {
            ...product,
            priceTTC: product.priceHT + vatRate
        }
    })
    return productsCompleted
}
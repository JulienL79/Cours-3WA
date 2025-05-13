export const calculatePriceTTC = (priceHT, vatRate = 0.2) => {
    return Math.floor(priceHT * vatRate * 100) / 100 + priceHT
}
import { calculatePriceTTC } from "./utils.js";

// Data

const priceHT = [
    { name : "Apple", priceHT : 1.0, priceTTC : null },
    { name : "Orange", priceHT : 1.2, priceTTC : null },
    { name : "Rasberry", priceHT : 2.5, priceTTC : null },
];

// Logique

priceHT.forEach(product => {
    product.priceTTC = calculatePriceTTC(product.priceHT)
})
console.table(priceHT)
import { addPriceTTC } from "./utils.js";

// Data

const priceHT = [
    { name : "Apple", priceHT : 1.0, priceTTC : null },
    { name : "Orange", priceHT : 1.2, priceTTC : null },
    { name : "Rasberry", priceHT : 2.5, priceTTC : null },
];

// Logique

const newPriceHt = addPriceTTC(priceHT, 0.2)
console.table(newPriceHt)


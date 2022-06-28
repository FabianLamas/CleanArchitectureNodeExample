const { inMemory: inMemoryDb } = require('../../database');
const { v4: uuidv4 } = require('uuid');

module.exports = {
    add: async (product) => {
        if(!product.id) {
            product.id = uuidv4();
        }
        inMemoryDb.products.push(product);
        return product;
    },
    update: async (product) => {
        const productIndex = inMemoryDb.products.findIndex(p => p.id === product.id);
        if(productIndex >= 0) {
            inMemoryDb.products[productIndex] = product;
            return product;
        }
        return null;
    },
    delete: async (product) => {
        const productIndex = inMemoryDb.products.findIndex(p => p.id === product.id);
        if(productIndex >= 0) {
            inMemoryDb.products.splice(productIndex, 1);
            return product;
        }
        return null;
    },
    getById: async (id) => {
        return inMemoryDb.products.find(p => p.id === id);
    }
}
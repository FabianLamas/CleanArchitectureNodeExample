const { inMemory: inMemoryDb } = require('../../database');
const { v4: uuidv4 } = require('uuid');

module.exports = {
    add: async (order) => {
        if(!order.id) {
            order.id = uuidv4();
        }
        inMemoryDb.orders.push(order);
        return order;
    },
    update: async (order) => {
        const orderIndex = inMemoryDb.orders.findIndex(o => o.id === order.id);
        if(orderIndex >= 0) {
            inMemoryDb.orders[orderIndex] = order;
            return order;
        }
        return null;
    },
    delete: async (order) => {
        const orderIndex = inMemoryDb.orders.findIndex(o => o.id === order.id);
        if(orderIndex >= 0) {
            inMemoryDb.orders.splice(orderIndex, 1);
            return order;
        }
        return null;
    },
    getById: async (id) => {
        return inMemoryDb.orders.find(o => o.id === id);
    }
};
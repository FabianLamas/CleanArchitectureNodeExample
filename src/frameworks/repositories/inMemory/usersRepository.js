const { inMemory: inMemoryDb } = require('../../database');
const { v4: uuidv4 } = require('uuid');

module.exports = {
    add: async (user) => {
        if(!user.id) {
            user.id = uuidv4();
        }
        inMemoryDb.users.push(user);
        return user;
    },
    update: async (user) => {
        const userIndex = inMemoryDb.users.findIndex(u => u.id === user.id);
        if(userIndex >= 0) {
            inMemoryDb.users[userIndex] = user;
            return user;
        }
        return null;
    },
    delete: async (user) => {
        const userIndex = inMemoryDb.users.findIndex(u => u.id === user.id);
        if(userIndex >= 0) {
            inMemoryDb.users.splice(userIndex, 1);
            return user;
        }
        return null;
    },
    getById: async (id) => {
        return inMemoryDb.users.find(u => u.id === id);
    },
}
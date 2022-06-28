const { ordersRepository } = require('../../../src/frameworks/repositories/inMemory');
const { Order } = require('../../../src/entities');
const Chance = require('chance');
const chance = new Chance();
const { cloneDeep, uniqueId } = require('lodash');
const { v4: uuidv4 } = require('uuid');

describe('Orders repository', () => {

    test('New order should be added and returned', async () => {
        const testOrder = new Order({
            userId: chance.natural(), 
            productsIds: [uuidv4(), uuidv4()],
            date: chance.date(),
            isPayed: true,
            meta: {
                comment: 'Deliver it to me as soon as possible'
            }
        });

        const addedOrder = await ordersRepository.add(testOrder);

        expect(addedOrder).toBeDefined();
        expect(addedOrder.id).toBeDefined();
        expect(addedOrder.userId).toBe(testOrder.userId);
        expect(addedOrder.productsIds).toEqual(testOrder.productsIds);
        expect(addedOrder.date).toEqual(testOrder.date);
        expect(addedOrder.isPayed).toBe(testOrder.isPayed);
        expect(addedOrder.meta).toEqual(testOrder.meta);

        const returnedOrder = await ordersRepository.getById(addedOrder.id);
        expect(returnedOrder).toEqual(addedOrder);
    });
    
    test('New order should be deleted', async () => {
        const willBeDeletedOrder = new Order({
            userId: uuidv4(), 
            productsIds: [uuidv4(), uuidv4()],
            date: chance.date(),
            isPayed: true,
            meta: {
                comment: 'Deliver it to me as soon as possible'
            }
        });
        const shouldStayOrder = new Order({
            userId: uuidv4(),
            productsIds: [uuidv4(), uuidv4()],
            date: chance.date(),
            isPayed: true,
            meta: {
                comment: 'Deliver it to me as soon as possible'
            }
        });

        const [ willBeDeletedAddedOrder, shouldStayAddedOrder ] = await Promise.all([ordersRepository.add(willBeDeletedOrder), ordersRepository.add(shouldStayOrder)]);
        expect(willBeDeletedAddedOrder).toBeDefined();
        expect(shouldStayAddedOrder).toBeDefined();
        
        const deletedOrder = await ordersRepository.delete(willBeDeletedAddedOrder);
        expect(deletedOrder).toEqual(willBeDeletedAddedOrder);
        expect(deletedOrder.id).toBe(willBeDeletedAddedOrder.id);
        expect(deletedOrder.userId).toBe(willBeDeletedAddedOrder.userId);
        expect(deletedOrder.productsIds).toEqual(willBeDeletedAddedOrder.productsIds);
        expect(deletedOrder.date).toEqual(willBeDeletedAddedOrder.date);
        expect(deletedOrder.isPayed).toBe(willBeDeletedAddedOrder.isPayed);
        expect(deletedOrder.meta).toEqual(willBeDeletedAddedOrder.meta);

        const returnedOrder = await ordersRepository.getById(deletedOrder.id);
        expect(returnedOrder).toBeUndefined();

        const shouldBeDefinedOrder = await ordersRepository.getById(shouldStayAddedOrder.id);
        expect(shouldBeDefinedOrder).toBeDefined();
    });

    test('Order should be updated', async () => {
        const testOrder = new Order({
            userId: uuidv4(),
            productsIds: [uuidv4(), uuidv4()],
            date: chance.date(),
            isPayed: true,
            meta: {
                comment: 'Deliver it to me as soon as possible'
            }
        });

        const addedOrder = await ordersRepository.add(testOrder);

        expect(addedOrder).toBeDefined();
        expect(addedOrder.id).toBeDefined();
        expect(addedOrder.userId).toBe(testOrder.userId);
        expect(addedOrder.productsIds).toEqual(testOrder.productsIds);
        expect(addedOrder.date).toEqual(testOrder.date);
        expect(addedOrder.isPayed).toBe(testOrder.isPayed);
        expect(addedOrder.meta).toEqual(testOrder.meta);

        const clonedOrder = cloneDeep({
            ...addedOrder,
            isPayed: false,
            productsIds: [...testOrder.productsIds, uuidv4()],
        });
        const updatedOrder = await ordersRepository.update(clonedOrder);
        expect(updatedOrder).toEqual(clonedOrder);
        expect(updatedOrder.id).toBe(clonedOrder.id);
        expect(updatedOrder.userId).toBe(clonedOrder.userId);
        expect(updatedOrder.productsIds).toEqual(clonedOrder.productsIds);
        expect(updatedOrder.date).toEqual(clonedOrder.date);
        expect(updatedOrder.isPayed).toBe(clonedOrder.isPayed);
        expect(updatedOrder.meta).toEqual(clonedOrder.meta);

        const returnedOrder = await ordersRepository.getById(updatedOrder.id);
        expect(returnedOrder).toEqual(updatedOrder);
    });
});

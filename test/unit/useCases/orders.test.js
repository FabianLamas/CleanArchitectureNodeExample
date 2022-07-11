const { order: { addOrderUseCase, getOrderByIdUseCase, updateOrderUseCase, deleteOrderUseCase } } = require('../../../src/useCases');
const { Order } = require('../../../src/entities');
const Chance = require('chance');
const chance = new Chance();
const { v4: uuidv4 } = require('uuid');
const { cloneDeep } = require('lodash');

describe('Order Use Case', () => {

    const testOrderData = {
        userId: uuidv4(),
        productsIds: [uuidv4(), uuidv4()],
        date: chance.date(),
        isPayed: false,
        meta: { comment: 'Please deliver it to me as soon as possible,  if not i will kill you' }
    };

    const mockOrderRepo = {
        add: jest.fn(async order => ({
            ...order,
            id: uuidv4()
        })),
        getById: jest.fn(async id => ({
            id, 
            userId: uuidv4(),
            productsIds: [uuidv4(), uuidv4()],
            date: chance.date(),
            isPayed: false,
            meta: { comment: 'Please deliver it to me as soon as possible' }
        })),
        update: jest.fn(async order => order),
        delete: jest.fn(async order => order)
    };

    const dependencies = {
        ordersRepository: mockOrderRepo
    };

    describe('Add order use case', () => {

        test('Order should be added', async () => {
            
            const addedOrder = await addOrderUseCase(dependencies).execute(testOrderData);
            expect(addedOrder).toBeDefined()
            expect(addedOrder.id).toBeDefined();
            expect(addedOrder.userId).toBe(testOrderData.userId);
            expect(addedOrder.date).toBe(testOrderData.date);
            expect(addedOrder.productsIds).toBe(testOrderData.productsIds);
            expect(addedOrder.isPayed).toBe(testOrderData.isPayed);
            expect(addedOrder.meta).toEqual(testOrderData.meta);

            const call = mockOrderRepo.add.mock.calls[0][0];
            expect(call.id).toBeUndefined();
            expect(call.meta).toEqual(testOrderData.meta);
        });
    });

    describe('Get order use case', () => {
            
        test('Order should be returned', async () => {
            const fakeId = uuidv4();
            const orderById = await getOrderByIdUseCase(dependencies).execute({ id: fakeId });

            expect(orderById).toBeDefined();
            expect(orderById.id).toBe(fakeId);
            expect(orderById.userId).toBeDefined();
            expect(orderById.date).toBeDefined();
            expect(orderById.productsIds).toBeDefined();
            expect(orderById.isPayed).toBeDefined();
            expect(orderById.meta).toBeDefined();

            const expectedId = mockOrderRepo.getById.mock.calls[0][0];
            expect(expectedId).toBe(fakeId);
        });
    });

    describe('Update order use case', () => {
            
        test('Order should be updated', async () => {
            const mockOrder = {
                ...testOrderData,
                id: uuidv4()
            };

            const updatedOrder = await updateOrderUseCase(dependencies).execute({ order: cloneDeep(mockOrder) });
            expect(updatedOrder).toBeDefined();
            expect(updatedOrder).toEqual(updatedOrder);

            const call = mockOrderRepo.update.mock.calls[0][0];
            expect(call).toEqual(mockOrder);

        });
    });

    describe('Delete order use case', () => {
                
        test('Order should be deleted', async () => {
            const mockOrder = {
                ...testOrderData,
                id: uuidv4()
            };

            const deletedOrder = await deleteOrderUseCase(dependencies).execute({ order: cloneDeep(mockOrder) });
            expect(deletedOrder).toBeDefined();
            expect(deletedOrder).toEqual(mockOrder);

            const call = mockOrderRepo.delete.mock.calls[0][0];
            expect(call).toEqual(mockOrder);
        });
    });
});
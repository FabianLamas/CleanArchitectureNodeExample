const { order: { addOrderUseCase, getOrderByIdUseCase, updateOrderUseCase, deleteOrderUseCase },
        user: { getUserByIdUseCase, addUserUseCase },
        product: { getProductByIdUseCase, addProductUseCase } } = require('../../../src/useCases');
const Chance = require('chance');
const chance = new Chance();
const { constants: { userConstants: { genders } } } = require('../../../src/entities');
const { v4: uuidv4 } = require('uuid');
const { cloneDeep } = require('lodash');
const { usersRepository, productsRepository } = require('../../../src/frameworks/repositories/inMemory');
const { ValidationError } = require('../../../src/frameworks/common');

describe('Order Use Case', () => {

    let testOrder;

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
        ordersRepository: mockOrderRepo,
        usersRepository,
        productsRepository,
        useCases: {
            user: {
                getUserByIdUseCase: jest.fn(dependencies => getUserByIdUseCase(dependencies))
            },
            product: {
                getProductByIdUseCase: jest.fn(dependencies => getProductByIdUseCase(dependencies))
            }
        }
    };

    const mocks = {};
    beforeAll(async () => {
        const addProduct = addProductUseCase(dependencies).execute;
        const addUser = addUserUseCase(dependencies).execute;

        mocks.products = await Promise.all([1, 2, 3].map(() => addProduct({
            name: chance.name(),
            description: chance.sentence(),
            images: [chance.url(), chance.url()],
            price: chance.natural(),
            color: chance.color(),
            meta: {
                review: chance.sentence()
            }
        })))

        mocks.users = await Promise.all([1, 2, 3].map(() => addUser({
            name: chance.name(),
            lastName: chance.last(),
            gender: genders.NOT_SPECIFIED,
            meta: {
                hair: {
                    color: chance.color()
                }
            }
        })))

        testOrder = {
            userId: mocks.users[0].id,
            productsIds: mocks.products.map(product => product.id),
            date: chance.date(),
            isPayed: false,
            meta: {
                comment: 'Please deliver it to me as soon as possible, if not i will kill you'
            }
        };
    })
    
    describe('Add order use case', () => {

        test('Order should be added', async () => {
            
            const addedOrder = await addOrderUseCase(dependencies).execute( testOrder );

            expect(addedOrder).toBeDefined()
            expect(addedOrder.id).toBeDefined();
            expect(addedOrder.userId).toBe(testOrder.userId);
            expect(addedOrder.date).toBe(testOrder.date);
            expect(addedOrder.productsIds).toBe(testOrder.productsIds);
            expect(addedOrder.isPayed).toBe(testOrder.isPayed);
            expect(addedOrder.meta).toEqual(testOrder.meta);

            const call = mockOrderRepo.add.mock.calls[0][0];
            expect(call.id).toBeUndefined();
            expect(call.meta).toEqual(testOrder.meta);
        });

        // test('should return validation error when product id unknown', async () => {
        //     const fakeId = uuidv4();
        //     try {
        //         // call add order
        //         await addOrderUseCase(dependencies).execute({
        //             ...testOrder,
        //             productsIds: [...testOrder.productsIds, fakeId]
        //         })
        //         expect(true).toBe(false);
        //     } catch (err) {
        //         expect(err.status).toBe(403);
        //         expect(err.validationErrors).toEqual([new ValidationError({field: 'productsIds', msg: `No products with ids ${fakeId}`})])
        //     }
        // });

        // test('should return validation error when user id unknown', async () => {
        //     const fakeId = uuidv4();
        //     try {
        //         // call add order
        //         await addOrderUseCase(dependencies).execute({
        //             ...testOrder,
        //             userId: fakeId
        //         })
        //         expect(true).toBe(false);
        //     } catch (err) {
        //         expect(err.status).toBe(403);
        //         expect(err.validationErrors).toEqual([new ValidationError({field: 'userId', msg: `No user with id ${fakeId}`})])
        //     }
        // })
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
                ...testOrder,
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
                ...testOrder,
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
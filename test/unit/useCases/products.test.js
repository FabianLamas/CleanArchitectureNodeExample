const { product: { addProductUseCase, getProductByIdUseCase, updateProductUseCase, deleteProductUseCase } } = require('../../../src/useCases');
const { Product } = require('../../../src/entities');
const Chance = require('chance');
const chance = new Chance();
const { v4: uuidv4 } = require('uuid');
const { cloneDeep } = require('lodash');

describe('Product Use Cases', () => {  

    const testProduct = new Product({
        name: chance.name(),
        description: chance.sentence(),
        images: [uuidv4(), uuidv4()],
        price: chance.natural(),
        color: chance.color(),
        meta: {
            comment: 'the best product for this year'
        }
    });

    const mockProductRepo = {
        add: jest.fn(async product => ({
            ...product,
            id: uuidv4()
        })),
        getById: jest.fn(async id => ({
            id,
            name: chance.name(),
            description: chance.sentence(),
            images: [uuidv4(), uuidv4()],
            price: chance.natural(),
            color: chance.color(),
            meta: {
                comment: 'the best product of the millenium'
            }
        })),
        update: jest.fn(async product => product),
        delete: jest.fn(async product => product)
    };

    const dependencies = {
        productsRepository: mockProductRepo
    };

    describe('Add Product Use Case', () => {

        test('Product should be added', async () => {
            const addedProduct = await addProductUseCase(dependencies).execute(testProduct);

            expect(addedProduct).toBeDefined();
            expect(addedProduct.id).toBeDefined();
            expect(addedProduct.name).toBe(testProduct.name);
            expect(addedProduct.description).toBe(testProduct.description);
            expect(addedProduct.images).toEqual(testProduct.images);
            expect(addedProduct.price).toBe(testProduct.price);
            expect(addedProduct.color).toBe(testProduct.color);
            expect(addedProduct.meta).toEqual(testProduct.meta);

            const call = mockProductRepo.add.mock.calls[0][0];
            expect(call.id).toBeUndefined();
            expect(call.name).toBe(testProduct.name);
            expect(call.description).toBe(testProduct.description);
            expect(call.images).toEqual(testProduct.images);
            expect(call.price).toBe(testProduct.price);
            expect(call.color).toBe(testProduct.color);
            expect(call.meta).toEqual(testProduct.meta);
        });
    });

    describe('Get Product Use Case', () => {
            
        test('Product should be returned by id', async () => {
            const fakeId = uuidv4();
            const productById = await getProductByIdUseCase(dependencies).execute({ id: fakeId });

            expect(productById).toBeDefined();
            expect(productById.id).toBe(fakeId);
            expect(productById.name).toBeDefined();
            expect(productById.description).toBeDefined();
            expect(productById.images).toBeDefined();
            expect(productById.price).toBeDefined();
            expect(productById.color).toBeDefined();
            expect(productById.meta).toBeDefined();

            const expectedId = mockProductRepo.getById.mock.calls[0][0];
            expect(expectedId).toBe(fakeId);
        });
    });

    describe('Update Product Use Case', () => {

        test('Product should be updated', async () => {
            const mockProduct = {
                ...testProduct,
                id: uuidv4()
            };
            const updatedProduct = await updateProductUseCase(dependencies).execute({ product: cloneDeep(mockProduct) });
            expect(updatedProduct).toEqual(mockProduct);
            
            const call = mockProductRepo.update.mock.calls[0][0];
            expect(call).toEqual(mockProduct);
        });
    });

    describe('Delete Product Use Case', () => {
        
        test('Product should be deleted', async () => {
            const mockProduct = {
                ...testProduct,
                id: uuidv4()
            };
            const deletedProduct = await deleteProductUseCase(dependencies).execute({ product: cloneDeep(mockProduct) });

            expect(deletedProduct).toEqual(mockProduct);

            const call = mockProductRepo.delete.mock.calls[0][0];
            expect(call).toEqual(mockProduct);
        }
        );
    });
});
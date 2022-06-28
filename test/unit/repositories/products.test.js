const { productsRepository } = require('../../../src/frameworks/repositories/inMemory');
const { Product } = require('../../../src/entities');
const Chance = require('chance');
const chance = new Chance();
const { cloneDeep } = require('lodash');

describe('Products repository', () => {

    test('New product should be added and returned', async () => {
        const testProduct = new Product({
            name: chance.name(), 
            description: chance.sentence(),
            images: [chance.url(), chance.url()],
            price: chance.natural(), 
            color: chance.color(), 
            meta: {
                deliver: {from: 'Moscow', to: 'London'},
            }
        });

        const addedProduct = await productsRepository.add(testProduct);

        expect(addedProduct).toBeDefined();
        expect(addedProduct.id).toBeDefined();
        expect(addedProduct.name).toBe(testProduct.name);
        expect(addedProduct.images).toEqual(testProduct.images);
        expect(addedProduct.price).toBe(testProduct.price);
        expect(addedProduct.description).toBe(testProduct.description);
        expect(addedProduct.meta).toEqual(testProduct.meta);

        const returnedProduct = await productsRepository.getById(addedProduct.id);
        expect(returnedProduct).toEqual(addedProduct);
    });

    test('New product should be deleted', async () => {
        const willBeDeletedProduct = new Product({
            name: chance.name(), 
            description: chance.sentence(),
            images: [chance.url(), chance.url()],
            price: chance.natural(), 
            color: chance.color(), 
            meta: {
                deliver: {from: 'Moscow', to: 'London'},
            }
        });
        const shouldStayProduct = new Product({
            name: chance.name(), 
            description: chance.sentence(),
            images: [chance.url(), chance.url()],
            price: chance.natural(), 
            color: chance.color(), 
            meta: {
                deliver: {from: 'UK', to: 'Australia'},
            }
        });

        const [ willBeDeletedAddedProduct, shouldStayAddedProduct ] = await Promise.all([productsRepository.add(willBeDeletedProduct), productsRepository.add(shouldStayProduct)]);
        expect(willBeDeletedAddedProduct).toBeDefined();
        expect(shouldStayAddedProduct).toBeDefined();
        
        const deletedProduct = await productsRepository.delete(willBeDeletedAddedProduct);
        expect(deletedProduct).toEqual(willBeDeletedAddedProduct);

        const shouldBeUndefinedProduct = await productsRepository.getById(deletedProduct.id);
        expect(shouldBeUndefinedProduct).toBeUndefined();

        const shouldBeDefinedProduct = await productsRepository.getById(shouldStayAddedProduct.id);
        expect(shouldBeDefinedProduct).toBeDefined();

    });

    test('New product should be updated', async () => {
        const testProduct = new Product({
            name: chance.name(), 
            description: chance.sentence(),
            images: [chance.url(), chance.url()],
            price: chance.natural(), 
            color: chance.color(), 
            meta: {
                deliver: {from: 'Moscow', to: 'London'},
            }
        });

        const addedProduct = await productsRepository.add(testProduct);
        expect(addedProduct).toBeDefined();
        expect(addedProduct.id).toBeDefined();
        expect(addedProduct.name).toBe(testProduct.name);
        expect(addedProduct.images).toEqual(testProduct.images);
        expect(addedProduct.price).toBe(testProduct.price);
        expect(addedProduct.description).toBe(testProduct.description);
        expect(addedProduct.meta).toEqual(testProduct.meta);

        const updatedProduct = cloneDeep(addedProduct);
        updatedProduct.name = chance.name();
        updatedProduct.images = [chance.url(), chance.url()];
        updatedProduct.price = chance.natural();
        updatedProduct.description = chance.sentence();
        updatedProduct.meta = {
            deliver: {from: 'UK', to: 'Australia'},
        };

        const updatedAddedProduct = await productsRepository.update(updatedProduct);
        expect(updatedAddedProduct).toEqual(updatedProduct);

        const returnedProduct = await productsRepository.getById(updatedAddedProduct.id);
        expect(returnedProduct).toEqual(updatedAddedProduct);
    });
});
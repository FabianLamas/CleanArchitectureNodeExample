const Chance = require('chance');
const {usersRepository} = require('../../../src/frameworks/repositories/inMemory');
const {User, constants: {userConstants: {genders}}} = require('../../../src/entities');
const chance = new Chance();
const { cloneDeep } = require('lodash');

describe('Users repositiry', () => {
    
    test('New user should be added and returned', async () => {
        const testUser = new User({
            name: chance.name(), 
            lastName: chance.last(), 
            gender: genders.FEMALE, 
            meta: {hair: {color: 'black'}}
        });

        const addedUser = await usersRepository.add(testUser);

        expect(addedUser).toBeDefined();
        expect(addedUser.id).toBeDefined();
        expect(addedUser.name).toBe(testUser.name);
        expect(addedUser.lastName).toBe(testUser.lastName);
        expect(addedUser.gender).toBe(testUser.gender);
        expect(addedUser.meta).toEqual(testUser.meta);

        const returnedUser = await usersRepository.getById(addedUser.id);
        expect(returnedUser).toEqual(addedUser);
    });

    test('User should be deleted', async () => {
        const willBeDeletedUser = new User({
            name: chance.name(), 
            lastName: chance.last(), 
            gender: genders.FEMALE, 
            meta: {hair: {color: 'blonde'}}
        });
        const shouldStayUser = new User({
            name: chance.name(), 
            lastName: chance.last(), 
            gender: genders.MALE, 
            meta: {hair: {color: 'red'}}
        });

        const [ willBeDeletedAddedUser, shouldStayAddedUser ] = await Promise.all([usersRepository.add(willBeDeletedUser), usersRepository.add(shouldStayUser)]);
        expect(willBeDeletedAddedUser).toBeDefined();
        expect(shouldStayAddedUser).toBeDefined();
        
        const deletedUser = await usersRepository.delete(willBeDeletedAddedUser);
        expect(deletedUser).toEqual(willBeDeletedAddedUser);

        const shouldBeUndefinedUser = await usersRepository.getById(deletedUser.id);
        expect(shouldBeUndefinedUser).toBeUndefined();

        const shouldBeDefinedUser = await usersRepository.getById(shouldStayAddedUser.id);
        expect(shouldBeDefinedUser).toBeDefined();

    });

    test('User should be updated', async () => {
        const testUser = new User({
            name: chance.name(), 
            lastName: chance.last(), 
            gender: genders.FEMALE, 
            meta: {hair: {color: 'black'}}
        });

        const addedUser = await usersRepository.add(testUser);
        expect(addedUser).toBeDefined();

        const clonedUser = cloneDeep({...addedUser, name: chance.name(), gender: genders.MALE});

        const updatedUser = await usersRepository.update(clonedUser);
        expect(updatedUser).toEqual(clonedUser);
    });
});
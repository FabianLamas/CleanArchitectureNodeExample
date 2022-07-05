const { user: { addUserUseCase, getUserByIdUseCase, updateUserUseCase, deleteUserUseCase } } = require('../../../src/useCases');
const { User, constants: { userConstants: { genders } } } = require('../../../src/entities');
const Chance = require('chance');
const chance = new Chance();
const { v4: uuidv4 } = require('uuid');

describe('User use cases', () => {

    const mockUserRepo = {
        add: jest.fn(async user => ({
            ...user,
            id: uuidv4()
        })),
        getById: jest.fn(async id => ({
            id,
            name: chance.name(),
            lastName: chance.last(),
            gender: genders.NOT_SPECIFIED,
            meta: {}
        })),
        update: jest.fn(async user => user),
        delete: jest.fn(async user => user)
    };

    const dependencies = {
        usersRepository: mockUserRepo
    };

    describe('Add user use case', () => {
        
        test('User should be added', async () => {
            const testUserData = {
                name: chance.name(),
                lastName: chance.last(),
                gender: genders.MALE,
                meta: {
                    hair: {
                        color: 'red'
                    }
                }
            }

            const addedUser = await addUserUseCase(dependencies).execute(testUserData);

            expect(addedUser).toBeDefined()
            expect(addedUser.id).toBeDefined();
            expect(addedUser.name).toBe(testUserData.name);
            expect(addedUser.lastName).toBe(testUserData.lastName);
            expect(addedUser.gender).toBe(testUserData.gender);
            expect(addedUser.meta).toEqual(testUserData.meta);

            const call = mockUserRepo.add.mock.calls[0][0];
            expect(call.id).toBeUndefined();
            expect(call.name).toBe(testUserData.name);
            expect(call.lastName).toBe(testUserData.lastName);
            expect(call.gender).toBe(testUserData.gender);
            expect(call.meta).toEqual(testUserData.meta);
        });
    });

    describe('Get user use case', () => {

        test('User should be returned by id', async () => {
            const fakeId = uuidv4();
            const userById = await getUserByIdUseCase(dependencies).execute({ id: fakeId });

            expect(userById).toBeDefined();
            expect(userById.id).toBe(fakeId);
            expect(userById.name).toBeDefined();
            expect(userById.lastName).toBeDefined();
            expect(userById.gender).toBeDefined();
            expect(userById.meta).toBeDefined();

            const expectedId = mockUserRepo.getById.mock.calls[0][0];
            expect(expectedId).toBe(fakeId)
        });
    });

    describe('Update user use case', () => {

        test('User should be updated', async () => {
            const testData = {
                id: uuidv4(),
                name: chance.name(),
                lastName: chance.last(),
                gender: genders.FEMALE,
                meta: {
                    education: {
                        school: 'full'
                    }
                }
            };
            const updatedUser = await updateUserUseCase(dependencies).execute({ user: testData });
            expect(updatedUser).toEqual(testData);

            const expectedUser = mockUserRepo.update.mock.calls[0][0];
            expect(expectedUser).toEqual(testData);
        });
    });

    describe('Delete user use case', () => {
        test('User should be deleted', async () => {
            const testData = {
                id: uuidv4(),
                name: chance.name(),
                lastName: chance.last(),
                gender: genders.FEMALE,
                meta: {
                    education: {
                        school: 'full'
                    }
                }
            };

            const deletedUser = await deleteUserUseCase(dependencies).execute({ user: testData });
            expect(deletedUser).toEqual(testData);

            const expectedUser = mockUserRepo.delete.mock.calls[0][0];
            expect(expectedUser).toEqual(testData);
        });
    });
});


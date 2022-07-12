const addUserController = require('./addUser.controller');
const getUserByIdController = require('./getUserById.controller');
const updateUserController = require('./updateUser.controller');
const deleteUserController = require('./deleteUser.controller');


module.exports = dependencies => {
    return {
        addUser: addUserController(dependencies),
        getUserById: getUserByIdController(dependencies),
        updateUser: updateUserController(dependencies),
        deleteUser: deleteUserController(dependencies)
    };
};
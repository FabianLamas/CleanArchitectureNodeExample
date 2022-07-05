const { Product } = require('../../entities');

module.exports = dependencies => {
    const { ordersRepository } = dependencies;

    if (!ordersRepository) {
        throw new Error('The orders repository should be exist in dependencies');
    }

    const execute = ({ 
        name,
        description,
        images,
        price,
        color,
        meta 
    }) => {
        const order = new Product({
            name,
            description,
            images,
            price,
            color,
            meta
        });
        
        return ordersRepository.add(order);
    }

    return { execute };
}
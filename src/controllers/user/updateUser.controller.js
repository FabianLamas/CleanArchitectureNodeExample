module.exports = dependencies => {
    
    const { useCases: { updateUserUseCase } } = dependencies;

    return async (req, res, next) => {
        try{
            const { body } = req;
            const { id, name, lastName, gender, meta } = body

            const updateUser = updateUserUseCase(dependencies);
            const response = await updateUser.execute({ user: { id, name, lastName, gender, meta} });

            res.json( new Response({
                status: true,
                content: response
            }));

            next();
        }catch(err){
            next(err);
        }
    };
};
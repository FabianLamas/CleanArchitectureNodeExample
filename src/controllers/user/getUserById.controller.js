module.exports = dependencies => {

    const { useCases: { getUserByIdUseCase } } = dependencies;

    return async (req, res, next) => {
        try{
            const { body = {} } = req;
            const { id } = body;

            const getUserById = getUserByIdUseCase(dependencies);
            const response = await getUserById.execute({ id });

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
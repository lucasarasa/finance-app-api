export class GetUserByIdUseCase {
    constructor(getUserByIdRepository) {
        this.getUserByIdRepository = getUserByIdRepository
    }

    async execute(userId) {
        const getUserByIdRepository = this.getUserByIdRepository

        const user = await getUserByIdRepository.execute(userId)

        return user
    }
}

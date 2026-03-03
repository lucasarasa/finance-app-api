import { v4 as uuidv4 } from 'uuid'
import { UserNotFoundError } from '../../errors/user.js'

export class CreateTransactionUseCase {
    constructor(createTransactionRepository, getUserByIdRepository) {
        this.createTransactionRepository = createTransactionRepository
        this.getUserByIdRepository = getUserByIdRepository
    }
    async execute(createTransactionParams) {
        // 1. verificar se o usuário existe
        const userId = createTransactionParams.userId
        const user = await this.getUserByIdRepository.execute(userId)
        if (!user) {
            throw new UserNotFoundError(userId)
        }

        // 2. gerar um ID para a transação
        const transactionId = uuidv4()

        // 2. criar a transação
        const transaction = await this.createTransactionRepository.execute({
            ...createTransactionParams,
            id: transactionId,
        })

        return transaction
    }
}

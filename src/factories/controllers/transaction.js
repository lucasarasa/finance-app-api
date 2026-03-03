import { CreateTransactionController } from '../../controllers/transaction/create-transaction.js'
import {
    postgresCreateTransactionRepository,
    PostgresGetUserByIdRepository,
} from '../../repositories/postgres/index.js'
import { CreateTransactionUseCase } from '../../use-cases/index.js'

export const makeCreateTransactionController = () => {
    const createTransactionRepository =
        new postgresCreateTransactionRepository()
    const getUserByIdRepository = new PostgresGetUserByIdRepository()
    const createTransactionUseCase = new CreateTransactionUseCase(
        createTransactionRepository,
        getUserByIdRepository,
    )
    const createTransactionController = new CreateTransactionController(
        createTransactionUseCase,
    )
    return createTransactionController
}

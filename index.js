import 'dotenv/config.js'
import express from 'express'
import {
    CreateUserController,
    DeleteUserController,
    GetUserByIdController,
    UpdateUserController,
} from './src/controllers/index.js'
import {
    CreateUserUseCase,
    DeleteUserUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
} from './src/use-cases/index.js'
import {
    PostgresCreateUserRepository,
    PostgresDeleteUserRepository,
    PostgresGetUserByEmailRepository,
    PostgresGetUserByIdRepository,
    PostgresUpdateUserRepository,
} from './src/repositories/postgres/index.js'

const app = express()

app.use(express.json())

app.get('/api/users/:userId', async (req, res) => {
    const getUserByIdRepository = new PostgresGetUserByIdRepository()
    const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository)
    const getUserByIdController = new GetUserByIdController(getUserByIdUseCase)

    const { statusCode, body } = await getUserByIdController.execute(req)
    res.status(statusCode).send(body)
})

app.post('/api/users', async (req, res) => {
    const getUserByEmailRepository = new PostgresGetUserByEmailRepository()
    const createUserRepository = new PostgresCreateUserRepository()
    const createUserUseCase = new CreateUserUseCase(
        getUserByEmailRepository,
        createUserRepository,
    )
    const createUserController = new CreateUserController(createUserUseCase)

    const { statusCode, body } = await createUserController.execute(req)

    res.status(statusCode).send(body)
})

app.patch('/api/users/:id', async (req, res) => {
    const getUserByEmailRepository = new PostgresGetUserByEmailRepository()
    const updateUserRepository = new PostgresUpdateUserRepository()
    const updateUserUseCase = new UpdateUserUseCase(
        getUserByEmailRepository,
        updateUserRepository,
    )
    const updateUserController = new UpdateUserController(updateUserUseCase)
    const { statusCode, body } = await updateUserController.execute(req)
    res.status(statusCode).send(body)
})

app.delete('/api/users/:id', async (req, res) => {
    const postgresDeleteUserRepository = new PostgresDeleteUserRepository()
    const deleteUserUseCase = new DeleteUserUseCase(
        postgresDeleteUserRepository,
    )
    const deleteUserController = new DeleteUserController(deleteUserUseCase)
    const { statusCode, body } = await deleteUserController.execute(req)
    res.status(statusCode).send(body)
})

app.listen(process.env.PORT, () =>
    console.log(`Listening on port ${process.env.PORT}`),
)

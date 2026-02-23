import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

import { PostgresCreateUserRepository } from '../repositories/postgres/create-user.js'
import { PostgresGetUserByEmailRepository } from '../repositories/postgres/get-user-by-emai.js'

export class CreateUserUseCase {
    async execute(createUsersParams) {
        // TODO: verificar se o e-mail já existe
        const postgresGetUserByEmailRepository =
            new PostgresGetUserByEmailRepository()

        const userWithProvidedEmail =
            await postgresGetUserByEmailRepository.execute(
                createUsersParams.email,
            )
        if (userWithProvidedEmail) {
            throw new Error('The provided email is already in use.')
        }

        // gerar ID do usuário
        const userId = uuidv4()

        // criptografar a senha
        const hashedPassword = await bcrypt.hash(createUsersParams.password, 10)

        // inserir o usuário no banco de dados
        const user = {
            id: userId,
            ...createUsersParams,
            password: hashedPassword,

            // outra forma de passar os parâmetros

            // ID: userId,
            // password: hashedPassword,
            // first_name: createUsersParams.first_name,
            // last_name: createUsersParams.last_name,
            // email: createUsersParams.email,
        }
        // chamar o repository
        const postgresCreateUserRepository = new PostgresCreateUserRepository()
        const createdUser = await postgresCreateUserRepository.execute(user)
        return createdUser
    }
}

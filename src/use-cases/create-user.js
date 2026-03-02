import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

import { EmailAlreadyInUseError } from '../errors/user.js'

export class CreateUserUseCase {
    constructor(getUserByEmailRepository, createUserRepository) {
        this.getUserByEmailRepository = getUserByEmailRepository
        this.createUserRepository = createUserRepository
    }
    async execute(createUsersParams) {
        // verificar se o e-mail já existe
        const userWithProvidedEmail =
            await this.getUserByEmailRepository.execute(createUsersParams.email)
        if (userWithProvidedEmail) {
            throw new EmailAlreadyInUseError(createUsersParams.email)
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

            // iD: userId,
            // password: hashedPassword,
            // first_name: createUsersParams.first_name,
            // last_name: createUsersParams.last_name,
            // email: createUsersParams.email,
        }
        // chamar o repository
        const createdUser = await this.createUserRepository.execute(user)
        return createdUser
    }
}

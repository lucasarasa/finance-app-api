import { UpdateUserUseCase } from '../use-cases/index.js'
import { EmailAlreadyInUseError } from '../errors/user.js'
import {
    checkIfEmailIsValid,
    checkIfIdIsValid,
    checkIfPasswordIsValid,
    emailIsAlreadyInUseResponse,
    invalidIdResponse,
    invalidPasswordResponse,
    ok,
    serverError,
    badRequest,
} from './helpers/index.js'

export class UpdateUserController {
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.id
            const isIdValid = checkIfIdIsValid(userId)

            if (!isIdValid) {
                return invalidIdResponse()
            }

            const params = httpRequest.body

            const allowedFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]

            const someFieldIsNotAllowed = Object.keys(params).some(
                (field) => !allowedFields.includes(field),
            )

            if (someFieldIsNotAllowed) {
                return badRequest({
                    message:
                        'Some field is not allowed to be updated. Allowed fields are: first_name, last_name, email and password.',
                })
            }

            if (params.password) {
                const passwordIsValid = checkIfPasswordIsValid(params.password)

                if (!passwordIsValid) {
                    return invalidPasswordResponse()
                }
            }

            if (params.email) {
                const emailIsValid = checkIfEmailIsValid(params.email)

                if (!emailIsValid) {
                    return emailIsAlreadyInUseResponse()
                }
            }

            const updateUserUseCase = new UpdateUserUseCase()
            const updateUser = await updateUserUseCase.execute(userId, params)
            return ok(updateUser)
        } catch (error) {
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message })
            }
            console.log('Error updating user:', error)
            return serverError()
        }
    }
}

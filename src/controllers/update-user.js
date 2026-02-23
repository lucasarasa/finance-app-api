import validator from 'validator'
import { ok, serverError, badRequest } from './helpers.js'
import { UpdateUserUseCase } from '../use-cases/update-user.js'
import { EmailAlreadyInUseError } from '../errors/user.js'

export class UpdateUserController {
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.id
            const isIdValid = validator.isUUID(userId)

            if (!isIdValid) {
                return badRequest({
                    message: 'The provided user ID is not valid',
                })
            }
            const updateUserParams = httpRequest.body

            const allowedFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]

            const someFieldIsNotAllowed = Object.keys(updateUserParams).some(
                (field) => !allowedFields.includes(field),
            )

            if (someFieldIsNotAllowed) {
                return badRequest({
                    message:
                        'Some field is not allowed to be updated. Allowed fields are: first_name, last_name, email and password.',
                })
            }

            if (updateUserParams.password) {
                const passwordIsNotValid = updateUserParams.password.length < 6

                if (passwordIsNotValid) {
                    return badRequest({
                        message: 'Password must be at least 6 characters long',
                    })
                }
            }

            if (updateUserParams.email) {
                const emailIsValid = validator.isEmail(updateUserParams.email)

                if (!emailIsValid) {
                    return badRequest({
                        message:
                            'Invalid email. Please provide a valid email address',
                    })
                }
            }

            const updateUserUseCase = new UpdateUserUseCase()
            const updateUser = await updateUserUseCase.execute(
                userId,
                updateUserParams,
            )
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

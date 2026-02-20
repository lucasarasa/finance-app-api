// posso fazer assim, ou seja, sem o return e as chaves, porque é um objeto literal, e o js entende que o que vem depois da seta é o retorno da função
// export const badRequest = (body) => {
//     return {
//         statusCode: 400,
//         body,
//     }
// }

export const badRequest = (body) => ({
    statusCode: 400,
    body,
})

export const created = (body) => ({
    statusCode: 201,
    body,
})

export const serverError = () => ({
    statusCode: 500,
    body: {
        errorMessage: 'Internal Server Error',
    },
})

export const ok = (body) => ({
    statusCode: 200,
    body,
})

const auth = '/auth'
const users = '/users'
const groups = '/groups'
const orders = '/orders'

const urls = {
    auth: {
        login: `${auth}/sign-in`,
        refresh: `${auth}/refresh`,
        me: `${auth}/me`,
        activateURL: `${auth}/activate`,
        recoveryURL: `${auth}/recovery`,
        createPassword: `${auth}/password/create`,
        recoveryPassword: `${auth}/password/recovery`,
    },
    users,
    groups,
    orders,
}

export {
    urls
}
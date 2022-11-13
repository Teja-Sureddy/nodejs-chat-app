export var users = [];

export const addUser = (socketId, user) => {
    user.socket = socketId
    users.push(user)
}

export const removeUser = (socketId) => {
    var index = users.findIndex((user) => user.socket === socketId)
    var user = { ...users[index] }
    if (index != -1) {
        users.splice(index, 1)
    }
    return user
}

export const combainTwoStringsBySort = (from, to) => {
    const compare = from.localeCompare(to);
    return (compare === -1) ? from + to : to + from
}
const host = 'https://wedev-api.sky.pro/api/v2/vera-pershina'
const authHost = 'https://wedev-api.sky.pro/api/user'

export let token = ''
export let name = ''

export const setToken = (newToken) => {
    token = newToken
}

export const setName = (newName) => {
    name = newName
}


export const fetchComments = () => {
    return fetch(host + '/comments')
        .then((res) => res.json())
        .then((responseData) => {
            const appComments = responseData.comments.map((comment) => {
                return {
                    name: comment.author.name,
                    date: new Date(comment.date),
                    text: comment.text,
                    likes: comment.likes,
                    isLiked: false,
                }
            })

            return appComments
        })
}

export const postComment = (text, name) => {
    return fetch(host + '/comments', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            text,
            name,
        }),
    })
        .then((response) => {
            if (response.status === 500) {
                throw new Error('Ошибка сервера')
            }

            if (response.status === 401) {
                throw new Error('Пользователь не авторизован')
            }

            if (response.status === 400) {
                throw new Error('Неверный запрос')
            }
        })
        .then(() => {
            return fetchComments()
        })
}


export const login = (login, password) => {
    return fetch(authHost + '/login', {
        method: 'POST',
        body: JSON.stringify({ login: login, password: password }),
    })
}

export const registration = (name, login, password) => {
    return fetch(authHost, {
        method: 'POST',
        body: JSON.stringify({ name: name, login: login, password: password }),
    })
}
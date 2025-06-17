const host = 'https://wedev-api.sky.pro/api/v2/vera-pershina'
const authHost = 'https://wedev-api.sky.pro/api/user'

export let token = ''
export let name = ''
export let loginAttempts = 0
const MAX_LOGIN_ATTEMPTS = 3

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
    if (!login.trim()) {
        alert('Пожалуйста, введите логин')
        return Promise.reject('Логин не может быть пустым')
    }

    if (!password.trim()) {
        alert('Пожалуйста, введите пароль')
        return Promise.reject('Пароль не может быть пустым')
    }

    if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        alert('Аккаунт заблокирован, обратитесь к администратору')
        return Promise.reject('Превышено количество попыток входа')
    }

    return fetch(authHost + '/login', {
        method: 'POST',
        body: JSON.stringify({ login: login, password: password }),
    })
        .then((response) => {
            if (!response.ok) {
                loginAttempts++
                if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
                    throw new Error(
                        'Аккаунт заблокирован, обратитесь к администратору',
                    )
                }
                return response.json().then((errorData) => {
                    throw new Error(
                        errorData.error ||
                            `Неверный логин или пароль. Осталось попыток: ${MAX_LOGIN_ATTEMPTS - loginAttempts}`,
                    )
                })
            }

            loginAttempts = 0
            return response.json()
        })
        .catch((error) => {
            alert(error.message)
            throw error
        })
}

window.addEventListener('load', () => {
    loginAttempts = 0
})

setInterval(
    () => {
        loginAttempts = 0
    },
    30 * 60 * 1000,
)

export const registration = (name, login, password) => {
    if (!name.trim()) {
        alert('Пожалуйста, введите имя')
        return Promise.reject('Имя не может быть пустым')
    }
    if (!login.trim()) {
        alert('Пожалуйста, введите логин')
        return Promise.reject('Логин не может быть пустым')
    }
    if (!password.trim()) {
        alert('Пожалуйста, введите пароль')
        return Promise.reject('Пароль не может быть пустым')
    }

    return fetch(authHost, {
        method: 'POST',
        body: JSON.stringify({
            name: name,
            login: login,
            password: password,
        }),
    }).then((response) => {
        if (!response.ok) {
            return response.text().then((text) => {
                try {
                    const errorData = JSON.parse(text)
                    throw new Error(errorData.error || 'Ошибка при регистрации')
                } catch {
                    throw new Error(
                        text || `HTTP error! status: ${response.status}`,
                    )
                }
            })
        }
        return response.json()
    })
}

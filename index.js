import { fetchComments } from './modules/api.js'
import { updateComments } from './modules/comments.js'
import { renderComments } from './modules/renderComments.js'


export const fetchAndRenderComments = (isFirstLoading) => {
    const container = document.querySelector('.container')

    if (isFirstLoading) {
        container.innerHTML = `
            <div id="comments-loading" class="loader"></div>
            <p class="loading-text">Пожалуйста подождите, загружаю комментарии...</p>
        `;
    }

    fetchComments()
        .then((data) => {
            updateComments(data);
            renderComments();
        })
        .catch((error) => {
            console.error("Ошибка загрузки комментариев:", error);
            container.innerHTML = `<p style="color: red;">Ошибка загрузки комментариев. Попробуйте позже.</p>`;
        });
};

fetchAndRenderComments(true)
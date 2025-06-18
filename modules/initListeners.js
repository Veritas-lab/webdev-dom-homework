import { postComment } from './api.js';
import { sanitizeHtml } from './utils.js';
import { comments, updateComments} from "./comments.js";

export const initLikeListeners = (renderComments) => {
    const likeButtons = document.querySelectorAll('.like-button');

    likeButtons.forEach((likeButton) => {
        likeButton.addEventListener("click", (event) => {
            event.stopPropagation();
            
            likeButton.classList.add('loading');
            
            const index = likeButton.dataset.index;
            const comment = comments[index];

            setTimeout(() => {
                comment.likes = comment.isLiked
                    ? comment.likes - 1
                    : comment.likes + 1;
                comment.isLiked = !comment.isLiked;
                
                if (comment.isLiked) {
                    likeButton.classList.add('-active-like');
                } else {
                    likeButton.classList.remove('-active-like');
                }
                
                renderComments();
                likeButton.classList.remove('loading');
            }, 800);
        });
    });
}

export const initReplyListeners = () => {
    const text = document.getElementById("text-input");
    const commentsElements = document.querySelectorAll('.comment');

    for (const commentElement of commentsElements) {
        commentElement.addEventListener('click', () => {
            const currentComment = comments[commentElement.dataset.index];
            text.value = `${currentComment.name}: ${currentComment.text}`;
        });
    }
}

export const initAddCommentListener = (renderComments) => {
    const name = document.getElementById('name-input');
    const text = document.getElementById('text-input');
    const addButton = document.querySelector('.add-form-button');
    const formLoading = document.querySelector('.form-loading');
    const addFormLoading = document.getElementById('add-form-loading');
    const addForm = document.querySelector(".add-form");

    addButton.addEventListener("click", () => {
        if (!name.value) {
            alert('Пожалуйста, введите ваше имя');
            return;
        }

        if (!text.value) {
            alert('Пожалуйста, напишите комментарий');
            return;
        }

        formLoading.style.display = 'block';
        addFormLoading.style.display = 'block';
        addForm.style.display = "none";

        const addTimeout = setTimeout(() => {
            addFormLoading.textContent = 'Добавление комментария занимает больше времени, чем обычно. Пожалуйста, подождите...';
        }, 3000);

        postComment(sanitizeHtml(text.value), sanitizeHtml(name.value))
            .then((data) => {
                clearTimeout(addTimeout);
                updateComments(data);
                renderComments();
                name.value = "";
                text.value = "";
            })
            .catch((error) => {
                clearTimeout(addTimeout);

                if (error.message === "Failed to fetch") {
                    alert("Проблемы с интернет-соединением. Проверьте подключение и попробуйте снова");
                } else if (error.message === "Ошибка сервера: попробуйте позже") {
                    alert("Ошибка сервера");
                } else if (error.message === "Неверный запрос") {
                    alert("Имя и комментарий должны быть не короче 3х символов");

                    name.classList.add("-error");
                    text.classList.add("-error");  
                    
                    setTimeout(() => {
                        name.classList.remove("-error");
                        text.classList.remove("-error");  
                    }, 2000);
                }
            })
            .finally(() => {
                formLoading.style.display = 'none';
                addFormLoading.style.display = 'none';
                addForm.style.display = "flex";
                addFormLoading.textContent = 'Комментарий добавляется...'; 
            });
    });
}
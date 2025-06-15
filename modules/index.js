import { fetchComments } from "./api.js";
import { updateComments } from "./comments.js";
import { renderComments } from "./renderComments.js";

renderComments();

const commentsLoading = document.getElementById('comments-loading');
const commentsLoadingText = document.getElementById('comments-loading-text');
const addFormLoading = document.getElementById('add-form-loading');

commentsLoading.style.display = 'block';
commentsLoadingText.style.display = 'block';

const loadingTimeout = setTimeout(() => {
  commentsLoadingText.textContent = 'Загрузка комментариев занимает больше времени, чем обычно. Пожалуйста, подождите...';
}, 3000);

fetchComments().then(data => {
  clearTimeout(loadingTimeout);
  updateComments(data);
  renderComments()
})
.catch(error => {
  clearTimeout(loadingTimeout);
  commentsLoadingText.textContent = 'Ошибка загрузки комментариев. Пожалуйста, попробуйте позже.';
  console.error(error);
})
.finally(() => {
  commentsLoading.style.display = 'none';
  commentsLoadingText.style.display = 'none';
});


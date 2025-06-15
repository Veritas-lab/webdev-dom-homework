import { comments } from "./comments.js";
import { initLikeListeners, initReplyListeners, initAddCommentListener } from "./initListeners.js";
import { token } from "./api.js"
import { renderLogin } from './renderLogin.js'


export const renderComments = () => {
  const container = document.querySelector(".container");

  const commentsHtml = comments
    .map((comment, index) => {
      return `
      <li class="comment" data-index="${index}">
        <div class="comment-header">
          <div>${comment.name}</div>
          <div>${comment.date.toLocaleDateString()}</div>
        </div>
        <div class="comment-body">
          <div class="comment-text">
          ${comment.text}
          </div>
        </div>
        <div class="comment-footer">
          <div class="likes">
            <span class="likes-counter">${comment.likes}</span>
            <button data-index="${index}" class="like-button ${
              comment.isLiked ? "-active-like" : ""
            }"></button>
          </div>
        </div>
      </li>`;
    })
    .join("");

    const addCommentHtml = `
    <div id="comments-loading" class="loader"></div>
    <p id="comments-loading-text" class="loading-text">Загружаем комментарии...</p>
    <ul class="comments"></ul>
    <div class="add-form">
      <input type="text" class="add-form-name" placeholder="Введите ваше имя" id="name-input" />
      <textarea type="textarea" class="add-form-text" placeholder="Введите ваш коментарий" rows="4" id="text-input"></textarea>
      <div class="add-form-row">
        <button class="add-form-button">Добавить</button>
      </div>
    </div>
    <div class="form-loading" style="display: none;">
      <div class="loader"></div>
    </div>
    <div id="add-form-loading" class="loading-text" style="display: none;">Комментарий добавляется...
    </div>`

     const linkToLoginText = `<p>чтобы отправить комментарий, <span class="link-login">войдите</span></p>`


    const baseHtml = `
        <ul class="comments">${commentsHtml}</ul>
        ${token ? addCommentHtml : linkToLoginText}`

    container.innerHTML = baseHtml

    initLikeListeners(renderComments)

    if (token) {
        initReplyListeners()
        initAddCommentListener(renderComments)
    } else {
        document.querySelector('.link-login').addEventListener('click', () => {
            renderLogin()
        })
    }
}

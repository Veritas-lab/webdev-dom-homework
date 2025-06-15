"use strict";
const name = document.getElementById("name-input");
const text = document.getElementById("text-input");

const sanitizeHtml = (value) => {
  return value.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
};

    const comments = [ {
      name: "Глеб Фокин",
      date: new Date(),
      text: "Это будет первый комментарий на этой странице",
      likes: 3,
      isLiked: false,
    },
    {
      name: "Варвара Н.",
      date: new Date(),
      text: "Мне нравится как оформлена эта страница! ❤",
      likes: 75,
      isLiked: true,
    }
    ];

const renderComments = () => {
const list = document.querySelector(".comments");
list.innerHTML = comments.map((comment, index) => {
return `<li class="comment" data-index="${index}">
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
      <button data-index="${index}" class="like-button ${comment.isLiked ? "-active-like" : ""}"></button>
    </div>
  </div>
</li>`;
}).
join("");

const likeButtons = document.querySelectorAll(".like-button");
for (const likeButton of likeButtons) { 
likeButton.addEventListener("click", (event) => {
  event.stopPropagation();

  const index = likeButton.dataset.index;
  const comment = comments[index];

  comment.likes = comment.isLiked
   ? comment.likes - 1
   : comment.likes + 1;
  comment.isLiked = !comment.isLiked;
  renderComments();
});
}
const commentsElements = document.querySelectorAll(".comment");
for (const commentElement of commentsElements) {
commentElement.addEventListener("click", () => {
  const currentComment = comments[commentElement.dataset.index];
  text.value = `${currentComment.name}: ${currentComment.text}`;

})
}
};

renderComments();

const addButton = document.querySelector(".add-form-button");

addButton.addEventListener("click", () => {

if (!name.value || !text.value) {
console.error("Пожалуйста, добавьте комментарий");
return 
}
const newComment = {
name: sanitazeHtml(name.value),
date: new Date(),
text: sanitazeHtml(text.value),
likes: 0,
isLiked: false,
};
comments.push(newComment);

renderComments();

name.value = "";
text.value = "";

});

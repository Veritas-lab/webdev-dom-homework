export let comments = []

export const updateComments = (newComments) => {
    comments = newComments
}

export const addComment = (newComment) => {
    comments.push(newComment)
}

export const toggleLike = (index) => {
    const comment = comments[index]
    comment.likes = comment.isLiked ? comment.likes - 1 : comment.likes + 1
    comment.isLiked = !comment.isLiked
}

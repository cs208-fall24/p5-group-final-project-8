document.getElementById('commentForm').addEventListener('submit', function(e) {
  e.preventDefault()
  const comment = e.target.comment.value

  fetch('/api/comments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ comment })
  })
    .then(response => response.json())
    .then(data => {
      loadComments()
      e.target.comment.value = ''
    })
    .catch(error => console.error('Error:', error))
})

function loadComments() {
  fetch('/api/comments')
    .then(response => response.json())
    .then(data => {
      const commentsList = document.getElementById('comments-list')
      commentsList.innerHTML = ''
      if (data.length === 0) {
        commentsList.innerHTML = '<li>No comments yet</li>'
      } else {
        data.forEach(comment => {
          const listItem = document.createElement('li')
          listItem.textContent = comment.text

          const deleteButton = document.createElement('button')
          deleteButton.textContent = 'Delete'
          deleteButton.addEventListener('click', function() {
            deleteComment(comment.id)
          })

          const editButton = document.createElement('button')
          editButton.textContent = 'Edit'
          editButton.addEventListener('click', function() {
            const newComment = prompt('Edit your comment:', comment.text)
            if (newComment) {
              editComment(comment.id, newComment)
            }
          })

          listItem.appendChild(editButton)
          listItem.appendChild(deleteButton)
          commentsList.appendChild(listItem)
        })
      }
    })
    .catch(error => console.error('Error:', error))
}

function deleteComment(commentId) {
  fetch(`/api/comments/${commentId}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => {
      loadComments()
    })
    .catch(error => console.error('Error:', error))
}

function editComment(commentId, newComment) {
  fetch(`/api/comments/${commentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: newComment })
  })
    .then(response => response.json())
    .then(data => {
      loadComments()
    })
    .catch(error => console.error('Error:', error))
}

loadComments() // Call this on page load

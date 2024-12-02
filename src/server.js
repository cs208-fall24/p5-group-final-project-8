import express from 'express'
import sql from 'sqlite3'

const sqlite3 = sql.verbose()

// Create an in-memory database
const db = new sqlite3.Database(':memory:')

// Create comments table
db.serialize(() => {
  db.run('CREATE TABLE comments (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT)')
})

const app = express()
app.use(express.static('public'))
app.set('views', 'views')
app.set('view engine', 'pug')
app.use(express.urlencoded({ extended: false }))
app.use(express.json()) // Add this line to parse JSON bodies

app.get('/', function (req, res) {
  console.log('GET called')
  res.render('index')
})

app.get('/student1', function (req, res) {
  console.log('GET called')
  res.render('student1')
})

app.get('/student2', function (req, res) {
  console.log('GET called')
  res.render('student2')
})

app.get('/student3', function (req, res) {
  console.log('GET called')
  res.render('student3')
})

// Route to render comments page
app.get('/comments', function (req, res) {
  res.render('student1/comments')
})


// API routes for comments
app.get('/api/comments', (req, res) => {
  db.all('SELECT * FROM comments', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json(rows)
  })
})

app.post('/api/comments', (req, res) => {
  const { comment } = req.body
  db.run('INSERT INTO comments (text) VALUES (?)', [comment], function(err) {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.status(201).json({ id: this.lastID, text: comment })
  })
})

app.put('/api/comments/:id', (req, res) => {
  const { id } = req.params
  const { text } = req.body
  db.run('UPDATE comments SET text = ? WHERE id = ?', [text, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ id, text })
  })
})

app.delete('/api/comments/:id', (req, res) => {
  const { id } = req.params
  db.run('DELETE FROM comments WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ message: 'Comment deleted' })
  })
})

// Start the web server
app.listen(3000, function () {
  console.log('Listening on port 3000...')
})

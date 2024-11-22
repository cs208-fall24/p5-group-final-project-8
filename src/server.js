import express from 'express'
import sql from 'sqlite3'

const sqlite3 = sql.verbose()

// Create an in memory table to use
const db = new sqlite3.Database(':memory:')

db.run(`CREATE TABLE feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  comment TEXT NOT NULL, 
  date DATETIME)`)

const app = express()
app.use(express.static('public'))
app.set('views', 'views')
app.set('view engine', 'pug')
app.use(express.urlencoded({ extended: false }))

app.get('/', function (req, res) {
  console.log('GET called')
  res.render('index')
})

app.get('/student1', function (req, res) {
  console.log('GET called for /student1')
  db.all('SELECT id, comment, date, (ROUND(((JULIANDAY("now") - JULIANDAY(date)) * 86400) / 60)) + 1 AS date FROM feedback', function (err, row) {
    if (err) {
      console.log(err)
      return res.status(500).send('Error has occurred')
    }
    const comments = row
    res.render('student1', { comments })
  })
})

app.get('/student1/feedback', function (req, res) {
  console.log('GET called for /student1/feedback')
  db.all('SELECT id, comment, date, (ROUND(((JULIANDAY("now") - JULIANDAY(date)) * 86400) / 60)) + 1 AS date FROM feedback', function (err, row) {
    if (err) {
      console.log(err)
      return res.status(500).send('Error has occurred')
    }
    const comments = row
    res.render('student1/feedback', { comments })
  })
})

app.post('/addComment', function (req, res) {
  const comment = req.body.comment
  db.run('INSERT INTO feedback (comment, date) VALUES (?, DATETIME("now"))', [comment], (err) => {
    if (err) {
      console.log(err)
      return res.status(500).send('Error has occurred')
    }
    res.redirect('/student1/feedback')
  })
  console.log('Comment added')
})

app.post('/editComment', function (req, res) {
  const comment = req.body.edit
  const id = req.body.id
  db.run('UPDATE feedback SET comment = ? WHERE id = ?', [comment, id], (err) => {
    if (err) {
      console.log(err)
      return res.status(500).send('Error has occurred')
    }
    res.redirect('/student1/feedback')
  })
  console.log('Comment edited')
})

app.post('/deleteComment', function (req, res) {
  const id = req.body.id
  db.run('DELETE FROM feedback WHERE id = ?', [id], (err) => {
    if (err) {
      console.log(err)
      return res.status(500).send('Error has occurred')
    }
    res.redirect('/student1/feedback')
  })
  console.log('Comment deleted')
})

app.get('/student2', function (req, res) {
  console.log('GET called')
  res.render('student2')
})

app.get('/student3', function (req, res) {
  console.log('GET called')
  res.render('student3')
})

// Start the web server
app.listen(3000, function () {
  console.log('Listening on port 3000...')
})

import express from 'express';
import sql from 'sqlite3';

const sqlite3 = sql.verbose();

// Create an in-memory database
const db = new sqlite3.Database(':memory:');

// Initialize the database table
db.serialize(() => {
  db.run('CREATE TABLE underwater_welding (id INTEGER PRIMARY KEY, comment TEXT)');
});

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

// gets comments when /student1/index is loaded
// @author Will White
app.get('/student1', function (req, res) {
  console.log('GET called for /student1')
  db.all('SELECT id, comment, date, (ROUND(((JULIANDAY("now") - JULIANDAY(date)) * 86400) / 60)) + 1 AS date FROM feedback', function (err, row) {
    if (err) {
      console.log(err)
      return res.status(500).send('Error has occurred')
    }
    // shuffles order of comments
    for (let i = row.length - 1; i > 0; i--) {
      const randomInt = Math.floor(Math.random() * (i + 1));
      [row[i], row[randomInt]] = [row[randomInt], row[i]]
    }
    const comments = row
    res.render('student1', { comments })
  })
})

// gets comments when /student1/feedback is loaded
// @author Will White
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

// posts comments when /addComment is called
// @author Will White
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

// edits comments when /editComment is called
// @author Will White
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

// deletes comments when /deleteComment is called
// @author Will White
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
const app = express();
app.use(express.static('public'));
app.set('views', 'views');
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: false }));

// Routes

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/student1', (req, res) => {
  res.render('student1');
});

app.get('/student2', (req, res) => {
  db.all('SELECT id, comment FROM underwater_welding LIMIT 5', (err, rows) => {
    if (err) {
      console.error('Error retrieving comments:', err);
      return res.status(500).send('Server error while retrieving comments.');
    }
    res.render('student2', { comments: rows });
  });
});

app.post('/student2/add-comment', (req, res) => {
  const { comment } = req.body;
  if (!comment) {
    return res.status(400).send('Comment cannot be empty.');
  }
  db.run('INSERT INTO underwater_welding (comment) VALUES (?)', [comment], (err) => {
    if (err) {
      console.error('Error adding comment:', err);
      return res.status(500).send('Server error while adding comment.');
    }
    res.redirect('/student2');
  });
});

app.post('/student2/delete-comment', (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).send('Invalid comment ID.');
  }
  db.run('DELETE FROM underwater_welding WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Error deleting comment:', err);
      return res.status(500).send('Server error while deleting comment.');
    }
    res.redirect('/student2');
  });
});

app.get('/student3', (req, res) => {
  res.render('student3');
});

// Start the web server
app.listen(3000, () => {
  console.log('Listening on port 3000...');
});

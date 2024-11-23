import express from 'express';
import sql from 'sqlite3';

const sqlite3 = sql.verbose();

// Create an in-memory database
const db = new sqlite3.Database(':memory:');

// Initialize the database table
db.serialize(() => {
  db.run('CREATE TABLE underwater_welding (id INTEGER PRIMARY KEY, comment TEXT)');
});

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

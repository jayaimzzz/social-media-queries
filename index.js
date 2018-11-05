const {
    Client
} = require('pg');
const express = require('express');

// create an express application
const app = express();
app.use(express.json());
// create a postgresql client
const client = new Client({
    database: 'social-media'
});

// route handlers go here
app.get('/users', (req, res) => {
    client.query('SELECT * FROM users', (err, result) => {
        res.send(result.rows);
    });
});

app.post('/users', (req, res) => {
    const text = 'INSERT INTO users (username, bio) VALUES ($1, $2) RETURNING *';
    const values = [req.body.username, req.body.bio]
    client.query(text, values, (err, result) => {
        const newUserID = result.rows[0].id
        res.send({
            "newUserID": newUserID
        })
    })
});

app.get('/users/:id', async function (req, res) {
    const text = 'SELECT users.id AS uid, posts.*, users.bio, users.username FROM users FULL JOIN posts ON users.id=posts.user_id WHERE users.id=$1';
    const values = [req.params.id];
    try {
        const result = await client.query(text, values)
        console.log(result.rows)
        let posts = result.rows[0].title === null?
        []:
        result.rows.map(result => {
            let object = {
                'id': result.id,
                'title': result.title,
                'body': result.body
            }
            return object
        })
        let body = {
            "username": result.rows[0].username,
            "bio": result.rows[0].bio,
            // "id": values[0],
            "id": result.rows[0].uid,
            "posts":posts
        }
        res.send(body)
    } catch (err) {
        console.log(err)
        res.status(500).send({"error:":err})
    } 
})






// start a server that listens on port 3000 and connects the sql client on success
app.listen(3000, () => {
    client.connect();
});
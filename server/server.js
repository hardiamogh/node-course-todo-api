const _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');
var { authenticate } = require('./middleware/authenticate');


var app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    })
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos });
    }, (e) => {
        res.status(400).send(e);
    })
});

// GET /todos/1234.

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    // validate id using isvalid
    // 404 - send backl empty 
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        console.log('found')
        console.log(todo)
        res.send({ todo });
    }, (e) => {

    }).catch((e) => {
        res.status(400).send();
    })
    res.send(req.params);
});

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    console.log(id);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send(todo);
    }).catch((e) => {
        Response.status(400).send();
    });

});

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    console.log(body);
    var user = new User(body);

    user.save().then((user) => {
        // res.send(user);
        console.log(user);
        return user.generateAuthToken();
    }).then((token) => {
        console.log(token);
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
});
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
})

app.listen(port, () => {
    console.log(`started at ${port}`);
});

module.exports = { app };